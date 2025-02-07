import { useLocation, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import CreateSample from './pages/CreateSample';
import Share from './pages/Share';

import './App.css';

/**
 * App Component
 * The main component that handles routing.
 * 
 * @component
 * @returns {JSX.Element} The Rendered app component.
 */
export default function App() {
	// get the current url path from the browser
	const location = useLocation();

	return (
	<div className='App'>
		{/* if only when the path is /create-sample, the back button will be shown */}
		<Header backButton={location.pathname.includes("/sample") || location.pathname.includes("create-sample") 
							|| location.pathname.includes("/share")} />
			<Routes>
				<Route path='/' element={<Main />} />
				<Route path='/create-sample' element={<CreateSample />} />
				<Route path='/sample/:sampleId' element={<CreateSample />} />
				<Route path='/share/:sampleId' element={<Share />} />
			</Routes>
		<Footer />
	</div> 
	);
}
