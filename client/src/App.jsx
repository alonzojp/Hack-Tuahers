import { Route, Routes, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";


import "./styles/index.css"

function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route index element={<Home />} />
					<Route path='/home' element={<Home />} />
					<Route path='/search' element={<Search />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
