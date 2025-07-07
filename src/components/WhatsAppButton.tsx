import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
	variant?: "sidebar" | "floating";
	hidden?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
	variant = "floating",
	hidden = false,
}) => {
	const phoneNumber = "+918003277763";
	const message = "Hi! I'm interested in your creator services.";

	const handleWhatsAppClick = () => {
		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
		window.open(whatsappUrl, "_blank");
	};

	if (hidden) {
		return null;
	}

	if (variant === "sidebar") {
		return (
			<button
				onClick={handleWhatsAppClick}
				className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-left bg-green-500 text-white hover:bg-green-600 shadow-lg"
			>
				<MessageCircle size={20} />
				<span className="font-medium">WhatsApp Us</span>
			</button>
		);
	}

	return (
		<button
			onClick={handleWhatsAppClick}
			className="fixed bottom-4 right-4 z-40 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
			title="Contact us on WhatsApp"
		>
			<MessageCircle size={20} />
		</button>
	);
};

export default WhatsAppButton;
