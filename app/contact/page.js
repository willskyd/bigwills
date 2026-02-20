import Breadcumb from '@/layouts/breadcumb'
import Layout from '@/layouts/layout'
import { Location } from '@/public/svg/icon'
import Link from 'next/link'
import ContactForm from '@/components/Contact/ContactForm'

export const metadata = {
    title: 'Contact',
}

export default function page() {
    return (
        <Layout>

            <Breadcumb firstChild={'Contact'} />
            <div className="industify_fn_contact">
                <div className="container">
                    <div className="contact_in">

                        <div className="map_holder">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.6724396985414!2d7.035732974019797!3d4.826190540558896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cdafeec0d07f%3A0xd550783dc7f12f1a!2sTorqtech%20Offshore%20Services%20Limited!5e0!3m2!1sen!2sng!4v1762429055409!5m2!1sen!2sng" 
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                className=" relative -mb-"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                              />
                            {/* <iframe width="100%" height="400" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe> */}
                        </div>

                        <div className="contact_holder">
                            <div className="contact_left">
                                <h3>Get in touch with us</h3>
                                <ContactForm />
                            </div>
                            <div className="contact_right">

                                <div className="fn_cs_location_list">
                                    <ul className="list">

                                        <li className="location_item">
                                            <div className="item">
                                                <div className="title_holder">
                                                    <span className="icon_wrapper">
                                                        <span className="icon">
                                                            <Location className="fn__svg" />
                                                        </span>
                                                        <span className="shape"></span>
                                                    </span>
                                                    <h3>Trans-Amadi Office</h3>
                                                </div>
                                                <div className="content_holder">
                                                    <ul>
                                                        <li>11 Trans-Amadi Oginigba, Port-Harcourt, Rivers State, Nigeria.</li>
                                                        <li>Phone: +234 803 456 7890</li>
                                                        <li>Email: <Link href="mailto:w.industify@gmail.com">Torqtech@gmail.com</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>

                                        {/* <li className="location_item">
                                            <div className="item">
                                                <div className="title_holder">
                                                    <span className="icon_wrapper">
                                                        <span className="icon">
                                                            <Location className="fn__svg" />
                                                        </span>
                                                        <span className="shape"></span>
                                                    </span>
                                                    <h3>Trans-Amadi Office</h3>
                                                </div>
                                                <div className="content_holder">
                                                    <ul>
                                                        <li>11 Trans-Amadi Oginigba, Port-Harcourt, Rivers State, Nigeria.</li>
                                                        <li>Phone: +234 803 456 7890</li>
                                                        <li>Email: <Link href="mailto:w.industify@gmail.com">Torqtech@gmail.com</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li> */}

                                        {/* <li className="location_item">
                                            <div className="item">
                                                <div className="title_holder">
                                                    <span className="icon_wrapper">
                                                        <span className="icon">
                                                            <Location className="fn__svg" />
                                                        </span>
                                                        <span className="shape"></span>
                                                    </span>
                                                    <h3>Trans-Amadi Office</h3>
                                                </div>
                                                <div className="content_holder">
                                                    <ul>
                                                        <li>11 Trans-Amadi Oginigba, Port-Harcourt, Rivers State, Nigeria.</li>
                                                        <li>Phone: +234 803 456 7890</li>
                                                        <li>Email: <Link href="mailto:w.industify@gmail.com">Torqtech@gmail.com</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </li> */}

                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
