import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from './LandingPage';
import HomePage from "./HomePage.tsx";
import ListingsPage from "./ListingsPage";
import CreateListing from "./CreateListing";
import MySelling from "./MySelling";
import SearchResults from "./SearchResults";
import ItemDetailsPage from "./ItemDetailsPage";
import CartPage from "./CartPage";
import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/listings" element={<ListingsPage/>}/>
                <Route path="/create-listing" element={<CreateListing/>}/>
                <Route path="/myselling" element={<MySelling/>}/>
                <Route path="/search" element={<SearchResults/>}/>
                <Route path="/item/:itemId" element={<ItemDetailsPage/>}/>
                <Route path="/cart" element={<CartPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
