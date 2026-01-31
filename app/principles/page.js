import Breadcumb from '@/layouts/breadcumb'
import Layout from '@/layouts/layout'

export const metadata = {
    title: 'Principles',
}

export default function page() {
    return (
        <Layout>
            <Breadcumb firstChild={'Principles'} />
            <div className="industify_fn_principles">
                <div className="container">
                    <div className="principles">
                        <ul>
                            <li>
                                <div className="item" id="Honesty">
                                    <div className="item_left">
                                        <h2>01.</h2>
                                      <h3>Honesty</h3>
                                  </div>
                                  <div className="item_right">
                                      <p>We believe honesty is the foundation of trust and lasting relationships. In every interaction—with our partners, clients, and team members—we commit to openness, fairness, and truth.</p>
                                      <p>By being transparent in our decisions and accountable for our actions, we create an environment where trust thrives and collaboration grows stronger.</p>
                                      <p>Honesty guides how we communicate, how we deliver on our promises, and how we take responsibility. It keeps us grounded, credible, and focused on doing what is right at all times.</p>
                                  </div>

                                </div>
                            </li>
                            <li>
                                <div className="item" id="Passion">
                                    <div className="item_left">
                                        <h2>02.</h2>
                                     <h3>Passion</h3>
                                </div>
                                <div className="item_right">
                                    <p>Passion drives everything we do. It fuels our commitment to excellence and pushes us to go beyond expectations in every project and responsibility.</p>
                                    <p>We approach our work with energy, creativity, and dedication, taking pride in delivering solutions that truly make a difference for our clients and partners.</p>
                                    <p>Our passion inspires continuous improvement, teamwork, and innovation, motivating us to grow, adapt, and consistently give our best.</p>
                                </div>

                                </div>
                            </li>
                            <li>
                                <div className="item" id='Quality'>
                                    <div className="item_left">
                                        <h2>03.</h2>
                                      <h3>Quality Work</h3>
                                </div>
                                <div className="item_right">
                                    <p>We are committed to delivering quality work in every detail. Excellence is not an option but a standard that guides how we plan, execute, and deliver our services.</p>
                                    <p>Through careful attention, skilled craftsmanship, and proven processes, we ensure that every outcome meets high standards of reliability and performance.</p>
                                    <p>Quality work reflects our professionalism, builds trust with our clients, and defines our reputation for consistency and long-term value.</p>
                                </div>

                                </div>
                            </li>
                            {/* <li>
                                <div className="item">
                                    <div className="item_left">
                                        <h2>04.</h2>
                                        <h3>Honesty</h3>
                                    </div>
                                    <div className="item_right">
                                        <p>Be humble in all dealings with our partners, clients and team members. True wisdom and understanding belong to the humble.</p>
                                        <p>Vestibulum ac pellentesque dui. Phasellus accumsan enim ex, eu pulvinar nibh sodales sed. Nunc massa urna, varius pellentesque pulvinar quis, laoreet faucibus lectus. Integer vulputate leo a cursus laoreet. Curabitur a mi vitae velit faucibus viverra eget at enim.</p>
                                        <p>Fusce interdum eget enim ac venenatis. Curabitur sem massa, placerat a metus in, laoreet tincidunt eros. Sed neque lorem, tincidunt non dapibus quis, pharetra porttitor mauris.</p>
                                    </div>
                                </div>
                            </li> */}
                            <li>
                                <div className="item">
                                    <div className="item_left">
                                        <h2>04.</h2>
                                        <h3>Humility</h3>
                                    </div>
                                    <div className="item_right">
                                        <p>Humility keeps us grounded and open to growth. We value respect, gratitude, and a willingness to learn from others in every interaction.</p>
                                        <p>By recognizing that success is built through collaboration, we listen, accept feedback, and appreciate the contributions of our partners, clients, and team members.</p>
                                        <p>Humility guides our leadership and teamwork, reminding us to serve with sincerity, act with respect, and pursue excellence without pride.</p>
                                    </div>

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
