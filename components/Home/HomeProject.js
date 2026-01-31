import { Arrow_r } from "@/public/svg/icon";
import Link from "next/link";

const portfolio1 = "/img/portfolio/boltpro.webp"
const portfolio2 = "/img/portfolio/cutpro.webp"
const portfolio3 = "/img/portfolio/firepro.webp"
const portfolio4 = "/img/portfolio/habitatpro.webp"

export default function HomeProject() {
    return (
        <>
            <div className="fn_cs_project_sticky_full">
                <div className="inner">
                    <div className="left_part">
                        <div className="fn_cs_sticky_section">
                            <h3>Our latest projects.</h3>
                            <p>At TorqTech, we rely on honesty, discipline and hard work and believe our success can be attributed to upholding a simple set of core values that date back to the beginning of the company.</p>
                             <p>
                               TorqTech is a specialist oil & gas services company offering bolt torquing, tensioning, 
                               and related mechanical solutions to clients both onshore and offshore. Unique to TorqTech 
                               is our fully integrated approach, combining skilled engineering, certified technicians, 
                               and precision equipment in-house to deliver safe, reliable, and efficient operations.
                             </p>
                            <Link href="/portfolio">View All Projects</Link>
                        </div>
                    </div>
                    <div className="right_part">
                        <div className="fn_cs_sticky_section">
                            <ul>
                                <li>
                                    <div className="item">
                                        <div className="img_holder">
                                            <img src="/img/thumb/700-500.jpg" alt="" />
                                            <div className="abs_img" style={{ "backgroundImage": `url(${portfolio1})` }}></div>
                                            <Link href="/portfolio/portfolioSinglePage1"></Link>
                                        </div>
                                        <div className="title_holder">
                                      <h3> <Link href="/portfolio/portfolioSinglePage1">Bolt Tensioning Project</Link></h3>
                                          <span className="desc">
                                            Our team executed a comprehensive bolt tensioning project, ensuring precise and uniform 
                                            preload across all critical joints. By using calibrated hydraulic tensioners and adhering 
                                            to strict safety and industry standards, we enhanced structural integrity, minimized 
                                            downtime, and delivered reliable, high-performance results for our client’s operations.
                                          </span>

                                            <p>
                                                <Link href="/portfolio/Bolt_Tensioning_pro">
                                                    <span className="text">More Details</span>
                                                    <span className="arrow">
                                                        <Arrow_r className="fn__svg" />
                                                    </span>
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="item">
                                        <div className="img_holder">
                                            <img src="/img/thumb/700-500.jpg" alt="" />
                                            <div className="abs_img" style={{ "backgroundImage": `url(${portfolio2})` }}></div>
                                            <Link href="/portfolio/portfolioSinglePage2"></Link>
                                        </div>
                                        <div className="title_holder">
                                  <h3> <Link href="/portfolio/portfolioSinglePage2">Cold Cutting Project</Link> </h3>
                                         <span className="desc">
                                           Our team successfully carried out a cold cutting project, performing precise cuts on pipes, 
                                           tanks, and structural steel without the use of heat or sparks. By eliminating fire hazards 
                                           and maintaining structural integrity, we ensured a safe, efficient, and compliant operation 
                                           for our client’s onshore and offshore facilities.
                                         </span>
                                        
                                            <p>
                                                <Link href="/portfolio/Cold_Cutting_pro">
                                                    <span className="text">More Details</span>
                                                    <span className="arrow">
                                                        <Arrow_r className="fn__svg" />
                                                    </span>
                                                </Link>
                                            </p>
                                        </div >
                                    </div >
                                </li >
                                <li>
                                    <div className="item">
                                        <div className="img_holder">
                                            <img src="/img/thumb/700-500.jpg" alt="" />
                                            <div className="abs_img" style={{ "backgroundImage": `url(${portfolio3})` }}></div>
                                            <Link href="/portfolio/portfolioSinglePage3"></Link>
                                        </div>
                                        <div className="title_holder">
                                 <h3> <Link href="/portfolio/portfolioSinglePage3">Fire and Gas Alarm System Services</Link> </h3>
                                         <span className="desc">
                                           We provided full installation, testing, and commissioning of fire and gas alarm systems, 
                                           ensuring early detection and safety compliance across industrial facilities. Our certified 
                                           team delivered reliable, fully-integrated solutions to protect personnel, assets, and operations.
                                         </span>
                                            <p>

                                                <Link href="/portfolio/Fire_&_Gas_System_pro">
                                                    <span className="text">More Details</span>
                                                    <span className="arrow">
                                                        <Arrow_r className="fn__svg" />
                                                    </span>
                                                </Link>
                                            </p>
                                        </div >
                                    </div >
                                </li >
                                <li>
                                    <div className="item">
                                        <div className="img_holder">
                                            <img src="/img/thumb/700-500.jpg" alt="" />
                                            <div className="abs_img" style={{ "backgroundImage": `url(${portfolio4})` }}></div>
                                            <Link href="/portfolio/portfolioSinglePage4"></Link>
                                        </div>
                                        <div className="title_holder">
                                     <h3> <Link href="/portfolio/portfolioSinglePage3">Habitat Service Project</Link> </h3>
                                         <span className="desc">
                                           Our team delivered a safe and efficient habitat service solution, providing a controlled
                                           and pressurised work environment for critical maintenance and repair operations. This
                                           allowed work to be carried out without full system shutdown, ensuring safety, reduced
                                           downtime, and operational continuity for the client.
                                         </span>
                                        
                                            <p>
                                                <Link href="/portfolio/Habitat_Preparation_pro">
                                                    <span className="text">More Details</span>
                                                    <span className="arrow">
                                                        <Arrow_r className="fn__svg" />
                                                    </span>
                                                </Link>
                                            </p>
                                        </div >
                                    </div >
                                </li >
                            </ul >
                        </div >
                    </div >
                </div >
            </div >
        </>
    )
}
