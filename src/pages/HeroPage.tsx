import { useEffect, useRef } from "react";
import gsap from "gsap";
import Observer from "gsap/Observer";
import { Slideshow } from "../components/slideshow.js";
import { preloadImages } from "../components/utils.js";
import "./HeroPage.css";

import FacebookIcon from './../assets/social-media/facebook.png';
import InstagramIcon from './../assets/social-media/instagram.png';
import LinkedInIcon from './../assets/social-media/linkedin.png';

gsap.registerPlugin(Observer);

const teamMembers = [
    { name: "Miguel Coelho", role: "AI Specialist", img: "teamMembers/alentejano2.jpg" },
    { name: "Máximo Volynets", role: "Software Engineer", img: "teamMembers/max.jpg" },
    { name: "Tomás Bio", role: "Project Manager", img: "teamMembers/Bio.jpg" },
    { name: "Beatriz Ornelas", role: "Cytology Expert", img: "teamMembers/Bia.jpg" },
    { name: "João Fidalgo", role: "UX/UI Designer", img: "teamMembers/fidalgo.jpg" }
];

const HeroPage: React.FC = () => {
    const slideshowRef = useRef<HTMLDivElement>(null);
    const slideshowInstance = useRef<Slideshow | null>(null);
    const textRef = useRef<HTMLDivElement>(null); // Ref for text animation
    const aboutRef = useRef<HTMLDivElement>(null); // About Us ref

    useEffect(() => {
        if (slideshowRef.current) {
            slideshowInstance.current = new Slideshow(slideshowRef.current);
        }

        const observer = Observer.create({
            type: "wheel,touch,pointer",
            onDown: () => slideshowInstance.current?.navigate(-1),
            onUp: () => slideshowInstance.current?.navigate(1),
            wheelSpeed: -1,
            tolerance: 10,
        });

        preloadImages(".slide__img").then(() => document.body.classList.remove("loading"));

        // Animate text when the slide becomes active
        gsap.fromTo(
            textRef.current,
            { opacity: 0, x: -100, skewX: "15deg" },
            { opacity: 1, x: 0, skewX: "0deg", duration: 1.5, ease: "power4.out", delay: 0.3 }
        );

        // ✅ Team Member Animation on Scroll
        gsap.from(".team-member", {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 1.2,
            ease: "power3.out",
        });

        return () => {
            observer.kill(); // Cleanup observer on component unmount
        };
    }, []);

    return (
        <>
            <div className="frame">
                {/* <div className="frame__title">
                    <img className="logo" src="/logo.png" alt="Logo" />
                </div> */}
				<nav className="frame__nav">
					<button className="frame__nav-button unbutton">Home</button>
					<button className="frame__nav-button unbutton">Our Vision</button>
					<button className="frame__nav-button unbutton">Swift Analysis </button>
					<button className="frame__nav-button unbutton">AI-Powered</button>
					<button className="frame__nav-button unbutton">About Us</button>
				</nav>
				<button className="frame__back unbutton">
					<span data-splitting>&larr; Go back</span>
				</button>
			</div>

            <div className="hero-page hero">
                <div className="slides" ref={slideshowRef}>

                    <div className="slide">
                        <div className="slide__inner">
                            <video autoPlay loop muted playsInline className="slide__video">
                                <source src="/cytology.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>

                    <div className="slide">
                        <div className="slide__inner">
                            <div className="slide__img">
                                <div className="slide__img-inner" style={{ backgroundImage: "url(/img/woman.jpg)" }}></div>
                            </div>
                            <div className="slide__content">
                                <div className="slide__content-img" style={{ backgroundImage: "url(/img/woman.jpg)" }}></div>
                                <h2>Our Vision</h2>
                                <p>Leading the future of digital cytology with advanced technology, precision, and innovation to enhance healthcare and transform laboratory practice.</p>
                            </div>
                        </div>
                    </div>

                    <div className="slide">
                        <div className="slide__inner">
                            <div className="slide__img">
                                <div className="slide__img-inner" style={{ backgroundImage: "url(/img/cell.jpg)" }}></div>
                            </div>
                            <div className="slide__content">
                                <div className="slide__content-img" style={{ backgroundImage: "url(/img/cell.jpg)" }}></div>
                                <h2>Swift Analysis</h2>
                                <p>We harness AI to streamline cytology, minimizing manual analysis and maximizing accuracy—so scientists can work smarter, not harder.</p>
                            </div>
                        </div>
                    </div>

                    <div className="slide">
                        <div className="slide__inner">
                            <div className="slide__img"><div className="slide__img-inner" style={{ backgroundImage: "url(/img/ai.jpg)" }}></div></div>
                            <div className="slide__content">
                                <div className="slide__content-img" style={{ backgroundImage: "url(/img/ai.jpg)" }}></div>
                                <h2>AI-Powered</h2>
                                <p>Cy2logic automates cytology analysis by identifying suspicious cellular fields using AI, pattern recognition, and clinical data, providing a pre-diagnosis to support pathologists in delivering accurate final diagnoses.</p>
                            </div>
                        </div>
                    </div>

                    <div className="slide about-us-slide" ref={aboutRef}>
                        <div className="slide__img-inner" style={{ backgroundImage: "url(/img/bk.jpg)" }}></div>
                        <h2 className="about-title">Meet Our Team</h2>
                        <div className="team-container">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="team-member">
                                    <div className="team-card">
                                        <div className="card-inner">
                                            <div className="team-front" style={{ backgroundImage: `url(${member.img})` }}>
                                                <h3>{member.name}</h3>
                                            </div>
                                            <div className="team-back">
                                                <h3>{member.name}</h3>
                                                <p>{member.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        ))}
                        </div>
                        <footer className="footer">
                            <p className="footer-text">&copy; 2024 Cy2logic. All Rights Reserved.</p>
                            <div className="social-links">
                                <a href="#" className="social-icon"><img src={LinkedInIcon} alt="LinkedIn" /></a>
                                <a href="#" className="social-icon"><img src={FacebookIcon} alt="Facebook" /></a>
                                <a href="#" className="social-icon"><img src={InstagramIcon} alt="Instagram" /></a>
                            </div>
                        </footer>
                    </div>
                </div>
                </div>
        </>
    );
};

export default HeroPage;