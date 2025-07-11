import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import { initGA } from "./utils/analytics";
import "./App.css";
import AB from "./components/AB";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	useEffect(() => {
		// Initialize Google Analytics
		// Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
		const GA_MEASUREMENT_ID = "G-7819JR0JJ4";
		initGA(GA_MEASUREMENT_ID);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<div className="min-h-screen bg-gray-50">
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/admin-access" element={<AdminRoute />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="*" element={<NotFound />} />
						<Route path="/ass" element={<AB />} />
					</Routes>
					<Toaster />
				</div>
			</Router>
		</QueryClientProvider>
	);
}

export default App;
