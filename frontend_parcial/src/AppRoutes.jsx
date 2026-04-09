import { Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { routeDictionary } from "./data/routeDictionary.js";
import EncuentroDetailPage from "./pages/EncuentroDetailPage.jsx";
import EncuentrosPage from "./pages/EncuentrosPage.jsx";
import EquiposPage from "./pages/EquiposPage.jsx";
import GruposPage from "./pages/GruposPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

const routeComponents = {
  inicio: HomePage,
  equipos: EquiposPage,
  encuentros: EncuentrosPage,
  grupos: GruposPage,
};

function AppRoutes() {
  return (
    <Routes>
      <Route element={<App />}>
        {routeDictionary
          .filter((route) => route.type === "page")
          .map((route) => {
            const PageComponent = routeComponents[route.key];

            if (!PageComponent) {
              return null;
            }

            if (route.index) {
              return <Route key={route.key} index element={<PageComponent />} />;
            }

            return <Route key={route.key} path={route.slug} element={<PageComponent />} />;
          })}

        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="encuentro/:id" element={<EncuentroDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
