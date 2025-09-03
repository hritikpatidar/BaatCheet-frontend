import React, { useState } from "react";
import {
  setFileDownloadProgress,
  setIsDownloading,
  setIsUserDetails,
  setViewImages,
} from "../../Redux/features/Chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  ChevronRight,
  FileArchive,
  ArrowLeft,
  ExternalLink,
  Star,
  Bell,
} from "lucide-react";
import { checkIfImage, isLink } from "../../Utils/Auth";
import moment from "moment";
import { useSocket } from "../../context/SocketContext";
import { getDownloadBufferFile } from "../../Services/ChatServices";
import ImageLightbox from "../../components/imagePreview";
import { useTranslation } from "react-i18next";

const ChatUserDetails = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const selectedUserDetails = useSelector(
    (state) => state?.ChatDataSlice?.selectChatUSer
  );
  const userFilesList = useSelector((state) => state?.ChatDataSlice?.filesList);
  const userLinksList = useSelector((state) => state?.ChatDataSlice?.linksList);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("media");
  const [showImage, setShowImage] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const isRtl = i18n.language === "ar" || i18n.language === "ur";
  const getAllMediaList = (media, type) => {
    const filteredMedia = media.filter((file) => {
      if (type === "files") return checkIfImage(file.fileUrl);
      if (type === "images") return !checkIfImage(file.fileUrl);
      if (type === "links") return isLink(file.message);
      return false;
    });

    const groupedData = filteredMedia.reduce((acc, file) => {
      const date = moment(file.createdAt).format("MMMM YYYY");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(file);
      return acc;
    }, {});

    return groupedData;
  };

  // **Filter messages date-wise**
  const allFiles = getAllMediaList(userFilesList, "files");
  const allDocs = getAllMediaList(userFilesList, "images");
  const allLinks = getAllMediaList(userLinksList, "links");

  const downloadFile = async (url, messageId, index) => {
    try {
      dispatch(setIsDownloading(index));
      dispatch(setFileDownloadProgress(0));

      let fileName = url.split("/").pop();
      let fileExtension = fileName.split(".").pop().toLowerCase();

      // These formats should open in a new tab
      const openInNewTabFormats = ["pdf", "txt", "md", "html", "xml", "mp4"];

      if (openInNewTabFormats.includes(fileExtension)) {
        window.open(url, "_blank"); // Open in a new tab
      } else {
        let link = document.createElement("a");
        link.href = url;
        link.download = fileName || "downloaded_file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Simulating download progress
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += 10;
        if (simulatedProgress <= 100) {
          dispatch(setFileDownloadProgress(simulatedProgress));
          if (socket.current) socket.current.emit("downloadFile", messageId);
        } else {
          clearInterval(progressInterval);
          dispatch(setFileDownloadProgress(100));
          dispatch(setIsDownloading(null));
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      dispatch(setIsDownloading(null));
      dispatch(setFileDownloadProgress(0));
    }
  };

  const downloadImages = async (url, index) => {
    dispatch(setIsDownloading(index));
    dispatch(setFileDownloadProgress(0));
    try {
      const payload = {
        img: url,
      };
      const response = await getDownloadBufferFile(payload);

      const byteArray = new Uint8Array(response.data.data.data);
      const blob = new Blob([byteArray], { type: "image/png" });
      const objectURL = URL.createObjectURL(blob);
      let simulatedProgress = 0;
      const progressInterval = setInterval(() => {
        simulatedProgress += 10;
        if (simulatedProgress <= 100) {
          dispatch(setFileDownloadProgress(simulatedProgress));
        } else {
          clearInterval(progressInterval);
          dispatch(setFileDownloadProgress(100));
          dispatch(setIsDownloading(null));
          let link = document.createElement("a");
          link.href = objectURL;
          const fileName = objectURL.split("/").pop();
          link.download = fileName || "downloaded_file";
          link.click();
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      dispatch(setIsDownloading(null));
      dispatch(setFileDownloadProgress(0));
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {!isMediaOpen ? (
        <div className="h-screen w-full flex flex-col">
          {/* Close Button */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-gray-900 text-md font-semibold text-base ps-2">
              {t("contact_info")}
            </h2>
            <button
              onClick={() => dispatch(setIsUserDetails(false))}
              className="text-gray-700 hover:text-gray-800 cursor-pointer"
            >
              <X className="text-md" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Profile Section */}
            <div className="flex flex-col items-center mt-4 px-4">
              {selectedUserDetails?.receiver?.profile ? (
                <img
                  src={selectedUserDetails?.receiver?.profile}
                  alt={selectedUserDetails?.receiver?.full_name}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border"
                />
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-4xl border">
                  {selectedUserDetails?.receiver?.full_name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>
              )}
              <h3 className="text-lg sm:text-xl font-semibold mt-2">
                {selectedUserDetails?.receiver?.full_name}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {selectedUserDetails?.receiver?.email}
              </p>
              <p className="text-gray-500 text-sm sm:text-base">
                {selectedUserDetails?.receiver?.phone_no}
              </p>
            </div>

            {/* About Section */}
            <div className="mt-6 border-t px-6 py-3">
              <h4 className="text-gray-500 text-sm uppercase font-medium">
                {t("about")}
              </h4>
              <p className="text-gray-700 text-base">{t("available")}</p>
            </div>

            {/* Media, Links & Docs */}
            <div
              className="border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-all"
              onClick={() => setIsMediaOpen(true)}
            >
              <h4 className="text-gray-700 font-medium">
                {t("media_links_docs")}{" "}
              </h4>
              <div className="flex items-center gap-2 text-gray-500">
                <span>{userFilesList?.length + userLinksList?.length}</span>
                <ChevronRight />
              </div>
            </div>

            {/* Media Preview */}
            {userFilesList?.length > 0 && (
              <div className="flex gap-2 mb-4 bg-gray-200 p-3 rounded-lg mt-3 mx-6 overflow-x-auto">
                {userFilesList?.slice(0, 3).map((file, index) =>
                  checkIfImage(file.fileUrl) ? (
                    <img
                      key={index}
                      src={file.fileUrl}
                      alt={`file-${index}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                    />
                  ) : (
                    <span
                      key={index}
                      className="text-gray-600 text-3xl rounded-full"
                    >
                      <FileArchive className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md" />
                    </span>
                  )
                )}
              </div>
            )}

            {/* Starred Messages */}
            <div className="border-t px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-all">
              <h4 className="text-gray-700 flex items-center font-medium">
                <Star size={16} className="mr-2 text-gray-600" />{" "}
                {t("starred_messages")}
              </h4>
            </div>

            {/* Mute Notifications */}
            <div className="border-t px-6 py-3 flex justify-between items-center">
              <h4 className="text-gray-700 flex items-center font-medium">
                <Bell size={16} className="mr-2 text-gray-600" />{" "}
                {t("mute_notifications")}
              </h4>
              <div dir={isRtl ? "rtl" : "ltr"}>
                <button
                  onClick={() => setIsChecked(!isChecked)}
                  className={`relative w-9 h-5 flex items-center rounded-full transition-all duration-300 
      ${isChecked
                      ? "ltr:bg-blue-900 rtl:bg-blue-900" // ON condition - correct for both
                      : "ltr:bg-gray-200 rtl:bg-gray-200"
                    } // OFF condition - default gray
      focus:outline-none`}
                >
                  <span
                    className={`absolute top-[2px] w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 
        ${isChecked
                        ? "ltr:left-[2px] rtl:right-[2px] translate-x-4 rtl:-translate-x-4"
                        : "ltr:left-[2px] rtl:right-[2px] translate-x-0"
                      }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Back Button */}
          <div className="flex justify-start items-center p-6">
            <button
              onClick={() => setIsMediaOpen(false)}
              className="text-gray-700 hover:text-gray-800 cursor-pointer"
            >
              <ArrowLeft className="text-md" />
            </button>
            <h4 className="text-gray-900 text-md font-semibold text-base ps-2">
              {t("media_links_docs")}
            </h4>
          </div>
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-300 bg-gray-200">
            {[t("media"), t("docs"), t("links")].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 flex-1 text-center capitalize ${activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                    : "text-gray-600"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Tab Content */}

          <div className="border-gray-300 bg-gray-200  min-h-[84vh] max-h-[79vh] overflow-y-auto">
            {activeTab === "media" && (
              <>
                {Object.keys(allFiles)?.length > 0 &&
                  Object.keys(allFiles)?.map((date, index) => (
                    <div key={index}>
                      <div className="vvv text-start ps-2 text-sm bg-gray-200 text-gray-600 font-semibold py-1">
                        {moment(date, "MMMM YYYY").isSame(moment(), "month")
                          ? t("this_month")
                          : date}
                      </div>
                      <div className="flex justify-center bg-gray-200 p-2">
                        <div className="grid grid-cols-3 gap-1 md:gap-2 lg:gap-3">
                          {allFiles[date].map((message, idx) => {
                            const isImage = checkIfImage(message.fileUrl);
                            if (!isImage) return null;
                            return (
                              <div
                                key={idx}
                                className="bg-white rounded-lg p-1 cursor-pointer overflow-hidden transition-transform hover:scale-105 "
                                onClick={() => {
                                  dispatch(setViewImages([message.fileUrl]));
                                  setShowImage(true);
                                }}
                              >
                                <img
                                  className="w-full h-[80px] md:h-[100px] lg:h-[120px] object-cover rounded-lg"
                                  src={message.fileUrl}
                                  alt="Sent Image"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
            {activeTab === "docs" && (
              <>
                {Object.keys(allDocs)?.length > 0 &&
                  Object.keys(allDocs)?.map((date, index) => (
                    <div key={index} className="">
                      {/* 📅 Date Header */}
                      <div className="text-start ps-2 text-sm bg-gray-200 text-gray-600 font-semibold py-1 ">
                        {moment(date, "MMMM YYYY").isSame(moment(), "month")
                          ? "This Month"
                          : date}
                      </div>

                      {/* 📂 Documents List (Single Column) */}
                      <div className="flex flex-col gap-4  px-2 bg-gray-200 ">
                        {allDocs[date].map((message, idx) => {
                          const fileName = message?.fileUrl.split("/").pop();
                          const fileExtension = fileName
                            .split(".")
                            .pop()
                            ?.toLowerCase();

                          return (
                            <div
                              key={idx}
                              className="bg-white shadow-md rounded-lg p-3 flex items-center gap-4 hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 w-full"
                              onClick={() =>
                                downloadFile(message.fileUrl, message?._id, idx)
                              }
                            >
                              {/* 📄 File Icon */}
                              <div className="p-3 bg-gray-300 rounded-lg flex items-center justify-center w-12 h-12 shrink-0">
                                <FileArchive className="w-6 h-6 text-gray-700" />
                              </div>

                              {/* 📁 File Details */}
                              <div className="flex-1 overflow-hidden">
                                <span className="text-sm font-semibold text-gray-700 truncate block max-w-[30ch]">
                                  {fileName}
                                </span>
                                <span className="text-xs text-gray-500 block">
                                  12:44 {t("am")}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </>
            )}
            {activeTab === "links" && (
              <>
                {Object.keys(allLinks)?.length > 0 &&
                  Object.keys(allLinks)?.map((date, index) => (
                    <div key={index} className="">
                      {/* 📅 Date Header */}
                      <div className="text-start ps-2 text-sm bg-gray-200 text-gray-600 font-semibold py-1 ">
                        {moment(date, "MMMM YYYY").isSame(moment(), "month")
                          ? "This Month"
                          : date}
                      </div>

                      {/* 📂 Documents List (Single Column) */}
                      <div className="flex flex-col gap-4  px-2 bg-gray-200 ">
                        {allLinks[date].map((message, idx) => {
                          const linkURL = message?.message;
                          const extractURL = (text) => {
                            const urlRegex = /(https?:\/\/[^\s]+)/gi;
                            const match = text.match(urlRegex);
                            return match ? match[0] : null;
                          };

                          const getDomainFavicon = (text) => {
                            const url = extractURL(text);
                            if (!url) return null;

                            try {
                              const domain = new URL(url).hostname;
                              return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
                            } catch {
                              return null;
                            }
                          };

                          return (
                            <div
                              className="bg-white shadow-md rounded-lg p-3 flex items-center gap-4 hover:shadow-lg transition duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 w-full"
                              onClick={() =>
                                window.open(extractURL(linkURL), "_blank")
                              }
                            >
                              {/* 🌐 Link Icon or Favicon */}
                              <div className="p-2 bg-gray-200 rounded-lg flex items-center justify-center w-12 h-12">
                                <img
                                  src={
                                    getDomainFavicon(linkURL) ||
                                    "/default-icon.png"
                                  }
                                  alt="Favicon"
                                  className="w-8 h-8"
                                />
                              </div>

                              {/* 📝 Link Details */}
                              <div className="flex flex-1 flex-col overflow-hidden">
                                <span className="text-sm font-semibold text-gray-700 truncate block max-w-[16ch]">
                                  {linkURL}
                                </span>
                                <span className="text-xs text-gray-500">
                                  12:44 {t("am")}
                                </span>
                              </div>

                              {/* 🔗 External Link Icon */}
                              <ExternalLink className="text-gray-500 w-5 h-5 shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </>
      )}
      {showImage && (
        <ImageLightbox
          downloadImages={downloadImages}
          setShowImage={setShowImage}
        />
      )}
    </div>
  );
};

export default ChatUserDetails;
