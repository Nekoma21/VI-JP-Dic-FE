import { BrowserRouter } from "react-router-dom";
import AllRouters from "./routers/index";

function App() {
  return (
    <BrowserRouter>
      <AllRouters />
    </BrowserRouter>
  );
}

export default App;
