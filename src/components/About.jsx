import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faGithub,
    faLinkedin,
    faDiscord
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const About = () => {
    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">About InsightNow</h2>
                            <p className="lead text-center mb-4">
                                Your Gateway to the World's Latest News
                            </p>
                            
                            <div className="mb-4">
                                <p>
                                    InsightNow is a cutting-edge news web application designed to deliver the latest and most relevant news from around the world. With its intuitive user interface and robust features, staying informed has never been easier.
                                </p>
                            </div>

                            <div className="mb-4">
                                <h4 className="mb-3">Key Features:</h4>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Personalized News Feed: Tailored to your interests</li>
                                    <li className="list-group-item">Search Functionality: Find articles on topics that matter to you</li>
                                    <li className="list-group-item">Push Notifications: Stay updated with breaking news</li>
                                    <li className="list-group-item">Social Media Integration: Share articles effortlessly</li>
                                    <li className="list-group-item">Bookmarking: Save articles for later reading</li>
                                    <li className="list-group-item">Discussion: Engage with other users</li>
                                </ul>
                            </div>

                            <div className="mb-4">
                                <h4 className="mb-3">UI Design:</h4>
                                <p>
                                    InsightNow boasts a sleek and user-friendly interface, designed to provide a seamless browsing experience. With its clean layout and intuitive navigation, finding and consuming news articles is a breeze.
                                </p>
                            </div>

                            <div className="mb-4">
                                <h4 className="mb-3">About the Creators:</h4>
                                <p>
                                    InsightNow was created by <span className="text-primary fw-bold">Piyush Khatwa and Anirudh Parihar</span>, passionate developers dedicated to delivering innovative solutions for staying informed in today's fast-paced world.
                                </p>
                            </div>

                            <div className="text-center mt-5">
                                <h5 className="mb-3">Connect With Us</h5>
                                <div className="d-flex justify-content-center gap-3">
                                    <a href="https://github.com/PiyushKhatwa" className="text-dark">
                                        <FontAwesomeIcon icon={faGithub} size="2x" />
                                    </a>
                                    <a href="https://www.linkedin.com/in/piyush-khatwa-9a75a9281/" className="text-primary">
                                        <FontAwesomeIcon icon={faLinkedin} size="2x" />
                                    </a>
                                    <a href="https://x.com/khatwa_piyush" className="text-info">
                                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                                    </a>
                                    <a href="https://discord.com/channels/@me" className="text-primary">
                                        <FontAwesomeIcon icon={faDiscord} size="2x" />
                                    </a>
                                    <a href="mailto:piyushkhatwa1819@gmail.com" className="text-danger">
                                        <FontAwesomeIcon icon={faEnvelope} size="2x" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
