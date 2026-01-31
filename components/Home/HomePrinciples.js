import { Arrow_r } from "@/public/svg/icon";
import Link from "next/link";

export default function HomePrinciples() {
    return (
        <>
            <div className="fn_cs_principles_modern">
                <div className="container">
                    <div className="inner">
                        <div className="shape"><span className="shape1"></span><span className="shape2"></span></div>
                        <ul className="fn_cs_miniboxes">
                            <li>
                                <div className="item">
                                    <div className="title_holder">
                                        <Link href="/principles#Honesty"></Link>
                                        <h3>Honesty</h3>
                                      <p>We believe honesty is the foundation of trust and lasting relationships. In every interaction—with our partners, clients, and team members—we commit to openness, fairness, and truth.</p>
                                        <span className="icon">
                                            <Arrow_r className="fn__svg" />
                                        </span>
                                    </div>
                                    <div className="number_holder">01</div>
                                </div>
                            </li>
                            <li>
                                <div className="item">
                                    <div className="title_holder">
                                        <Link href="/principles#Passion"></Link>
                                        <h3>Passion</h3>
                                    <p>Passion drives everything we do. It fuels our commitment to excellence and pushes us to go beyond expectations in every project and responsibility.</p>
                                        <span className="icon">
                                            {/* <Arrow_r className="fn__svg" /> */}
                                        </span>
                                    </div>
                                    <div className="number_holder">02</div>
                                </div>
                            </li>
                            <li>
                                <div className="item">
                                    <div className="title_holder">
                                        <Link href="/principles#Qualiy"></Link>
                                        <h3>Quality Work</h3>
                                    <p>We are committed to delivering quality work in every detail. Excellence is not an option but a standard that guides how we plan, execute, and deliver our services.</p>
                                        <span className="icon">
                                            <Arrow_r className="fn__svg" />
                                        </span>
                                    </div>
                                    <div className="number_holder">03</div>
                                </div>
                            </li>
                        </ul >
                    </div >
                </div >
            </div >
        </>
    )
}
