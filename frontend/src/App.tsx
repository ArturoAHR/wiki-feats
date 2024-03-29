import { Layout } from "./components/layout/Layout";
import { Providers } from "./providers/Providers";
import { Router } from "./Router";

function App() {
  return (
    <Providers>
      <Layout>
        <Router />
      </Layout>
    </Providers>
  );
}

export default App;
