import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AiStudioPage } from "./pages/AiStudioPage";
import { AuthPage } from "./pages/AuthPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { ProductPage } from "./pages/ProductPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="ai-studio" element={<AiStudioPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
