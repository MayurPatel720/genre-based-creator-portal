import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Demo from "./Demo";
import Admin from "./pages/Admin";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<PrimeReactProvider>
			<TooltipProvider>
				<Toaster />
				<Sonner />
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Index />} />
						<Route path="/demo" element={<Demo />} />
						<Route path="/admin" element={<Admin />} />
						{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</TooltipProvider>
		</PrimeReactProvider>
	</QueryClientProvider>
);

export default App;
