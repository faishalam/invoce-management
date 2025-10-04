export default function ContinueWithSection() {
    return (
        <section className="w-full max-w-full">
            <div className="relative">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="px-6 text-gray-900">Or continue with</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                    href="#"
                    className="flex w-full items-center cursor-not-allowed justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                        <path
                            d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                            fill="#EA4335"
                        />
                        <path
                            d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                            fill="#4285F4"
                        />
                        <path
                            d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                            fill="#34A853"
                        />
                    </svg>
                    <span className="text-sm font-semibold leading-6">Google</span>
                </a>

                <a
                    href="#"
                    className="flex w-full  items-center justify-center cursor-not-allowed gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current rounded-full text-blue-600">
                        <path
                            d="M22.675 0H1.325C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.41c0-3.1 1.893-4.787 4.659-4.787 1.325 0 2.463.099 2.796.143v3.24l-1.917.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.622h-3.123V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.675 0z"
                        />
                    </svg>
                    <span className="text-sm font-semibold leading-6">Facebook</span>
                </a>
            </div>
        </section>
    )
}