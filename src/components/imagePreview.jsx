import { useState } from "react";
import "react-image-lightbox/style.css";
import { ArrowDownToLine, X } from "lucide-react";
import { useSelector } from "react-redux";

const ImageLightbox = ({ downloadImages,setShowImage }) => {
    const imageUrl = useSelector((state) => state?.ChatDataSlice?.viewImages);
    const [scale, setScale] = useState(0.5);
    const [cursor, setCursor] = useState("default");
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

    const handleWheel = (event) => {
        setScale((prev) => (event.deltaY < 0 ? prev * 1.1 : prev * 0.9));
        setCursor(event.deltaY < 0 ? "zoom-in" : "zoom-out");
    };

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setStartPosition({ x: event.clientX - position.x, y: event.clientY - position.y });
        setCursor("grabbing");
    };

    const handleMouseMove = (event) => {
        if (!isDragging) return;
        setPosition({
            x: event.clientX - startPosition.x,
            y: event.clientY - startPosition.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setCursor("grab");
    };


    return (
        <div
            className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex flex-col items-center justify-center backdrop-brightness-0"
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor }}
        >
            
            {/* 🔹 Modal Header */}
            <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-gray-900 text-white shadow-md z-50">
                <h2 className="text-xl font-semibold">Image Viewer</h2>
                <div className="flex gap-4">
                    <button
                        className="text-gray-500 hover:text-white"
                        onClick={() => downloadImages(imageUrl)}
                    >
                        <ArrowDownToLine className="w-5 h-5" />
                    </button>
                    <button
                        className="text-gray-500 hover:text-white"
                        onClick={() => setShowImage(false)}
                    >
                        <X className=" w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 🔹 Image View */}
            <img
                src={imageUrl}
                className=" w-[50%] bg-cover transition-transform duration-300"
                style={{
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                }}
                onMouseDown={handleMouseDown}
                draggable={false}
                alt="Zoom & Drag"
            />
        </div>
    );
};

export default ImageLightbox;
