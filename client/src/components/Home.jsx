import Header from '../home_components/Header';
import Main from '../home_components/Main';
import Blog from '../home_components/Blog';
import About from '../home_components/About';
import Footer from '../home_components/Footer';

function Home() {
    return (
        <div className='overflow-x-hidden '>
            <Header />
            <Main />
            <Blog />
            <About />
            <Footer />
        </div>
    )
}

export default Home