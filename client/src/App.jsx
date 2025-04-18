import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import Navbar from "./components/ui/Navbar";

function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<Signup />} />
					<Route path='' element={<Navbar />}>
						<Route path='/home' element={<Home />} />



						
					</Route>
					
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
