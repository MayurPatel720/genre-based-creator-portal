
import React from "react";
import { MessageCircle, Phone } from "lucide-react";

interface WhatsAppButtonProps {
	variant?: "floating" | "sidebar" | "default";
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ variant = "default" }) => {
	const handleWhatsAppClick = () => {
		const phoneNumber = "+1234567890"; // Replace with actual WhatsApp number
		const message = "Hi! I'm interested in learning more about your creators.";
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
	};

	if (variant === "floating") {
		return (
			<button
				onClick={handleWhatsAppClick}
				className="fixed bottom-6 right-6 z-50 gradient-aureolin-orange hover:gradient-orange-purple text-black hover:text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-2 border-white"
				aria-label="Contact us on WhatsApp"
			>
				<MessageCircle size={24} />
			</button>
		);
	}

	if (variant === "sidebar") {
		return (
			<button
				onClick={handleWhatsAppClick}
				className="w-full flex items-center justify-center gap-3 gradient-aureolin-orange hover:gradient-orange-purple text-black hover:text-white px-4 py-3 rounded-xl font-quinn font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-transparent hover:border-white"
				aria-label="Contact us on WhatsApp"
			>
				<MessageCircle size={20} />
				<span>Contact Us</span>
			</button>
		);
	}

	return (
		<button
			onClick={handleWhatsAppClick}
			className="flex items-center gap-2 gradient-aureolin-orange hover:gradient-orange-purple text-black hover:text-white px-6 py-3 rounded-xl font-quinn font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-transparent hover:border-white"
			aria-label="Contact us on WhatsApp"
		>
			<Phone size={18} />
			<span>WhatsApp</span>
		</button>
	);
};

export default WhatsAppButton;
