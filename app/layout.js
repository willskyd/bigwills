import { Suspense } from 'react'
import 'swiper/css/effect-fade'
import '../node_modules/react-modal-video/css/modal-video.css'
import '../public/css/base.css'
import '../public/css/custom.css'
import '../public/css/fontawesome-all.min.css'
import '../public/css/fontello.css'
import '../public/css/justified.css'
import '../public/css/magnific-popup.css'
import '../public/css/nice-select.css'
import '../public/css/style.css'
import '../public/css/swiper.css'
import Loading from './loading'
// import 'metismenujs/dist/metismenujs.css'
import { Open_Sans, Rubik } from 'next/font/google'

const rubik = Rubik({
    subsets: ['latin'],
    display: 'swap',
    variable: '--Rubik'
})
const openSans = Open_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--OpenSans'
})


export const metadata = {
    title: {
        template: 'Torqtech | %s',
        default: 'Torqtech oil and gas services company',
    },
    icons: {
        icon: "/favicon.ico",
        // apple: "/apple-icon.png",
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </head>
            <body className={`${openSans.className} ${rubik.className}`}>
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </body>
        </html>
    )
}
