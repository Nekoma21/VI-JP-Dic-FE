import { BrowserRouter } from "react-router-dom";
import AllRouters from "./routers/index";
import { AuthProvider } from "./contexts/AccountContext";
import AuthWrapper from "./AuthWrapper";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper>
          <AllRouters />
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
