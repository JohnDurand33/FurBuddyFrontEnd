import { useState } from 'react'
import { Route, Routes, Router } from 'react-router-dom'

function App() {
    const [count, setCount] = useState(0)

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Nested routes */}
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App
