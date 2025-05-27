import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {NotificationProvider} from "./services/NotificationContext";
import LandingPage from './LandingPage';
import HomePage from "./HomePage.tsx";
import ListingsPage from "./ListingsPage";
import CreateListing from "./CreateListing";
import MySelling from "./MySelling";
import SearchResults from "./SearchResults";
import ItemDetailsPage from "./ItemDetailsPage";
import CartPage from "./CartPage";
import './index.css';
import ViewHistory from "./ViewHistory";
import NotificationsPage from "./NotificationsPage";
import SettingsPage from "./SettingsPage";

function App() {
    return (
        <NotificationProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/login" element={<LandingPage/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/listings" element={<ListingsPage/>}/>
                    <Route path="/create-listing" element={<CreateListing/>}/>
                    <Route path="/myselling" element={<MySelling/>}/>
                    <Route path="/search" element={<SearchResults/>}/>
                    <Route path="/item/:itemId" element={<ItemDetailsPage/>}/>
                    <Route path="/cart" element={<CartPage/>}/>
                    <Route path="/viewHistory" element={<ViewHistory/>}/>
                    <Route path="/notifications" element={<NotificationsPage/>}/>
                    <Route path="/settings" element={<SettingsPage/>}/>
                </Routes>
            </Router>
        </NotificationProvider>
    );
}

export default App;
