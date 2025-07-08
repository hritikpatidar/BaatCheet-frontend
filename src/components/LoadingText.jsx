import { useEffect, useState } from "react";

const LoadingText = () => {
    const fullText = "BaatCheet";
    const [displayedText, setDisplayedText] = useState("");
    const [showDots, setShowDots] = useState(true);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (showDots) {
            const dotTimer = setTimeout(() => {
                setShowDots(false);
                setDisplayedText("");
                setIndex(0);
            }, 1500);
            return () => clearTimeout(dotTimer);
        }
    }, [showDots]);

    useEffect(() => {
        if (!showDots && index < fullText.length) {
            const typingTimer = setTimeout(() => {
                setDisplayedText((prev) => prev + fullText[index]);
                setIndex(index + 1);
            }, 120);
            return () => clearTimeout(typingTimer);
        }

        if (index === fullText.length) {
            const restartTimer = setTimeout(() => {
                setShowDots(true);
            }, 1200);
            return () => clearTimeout(restartTimer);
        }
    }, [index, showDots]);

    const baat = displayedText.slice(0, 4);
    const cheet = displayedText.slice(4);

    return (
        <div className="flex items-center justify-center ">
            {showDots ? (
                <h1 className="text-4xl font-mono font-semibold text-center animate-fadeIn tracking-wide relative">
                    <span className="text-teal-600">{baat}</span>
                    <span className="text-gray-800">{cheet}</span>
                    <span className="absolute -right-3 top-0 animate-blink text-gray-800">|</span>
                </h1>
            ) : (
                <h1 className="text-4xl font-mono font-semibold text-center animate-fadeIn tracking-wide relative">
                    <span className="text-teal-600">{baat}</span>
                    <span className="text-gray-800">{cheet}</span>
                    <span className="absolute -right-3 top-0 animate-blink text-gray-800">|</span>
                </h1>
            )}
        </div>
    );
};

export default LoadingText;
