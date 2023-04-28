import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {GetBills} from '../pages/graphql';

export const AppRouter = () => {
    return (
    <Router>
        <Routes>
            <Route path="/" exact element={<GetBills />} />
            <Route path="/GetBills" exact element={<GetBills />} />
        </Routes>
    </Router>
    )
}