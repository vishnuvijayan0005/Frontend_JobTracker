This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


below code is for ad purpose can ,add later to user->home page->paste after 1st div....
{openAd && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 backdrop-blur-sm">
          {/* Banner */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full mt-10 overflow-hidden flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/3 w-full h-32 md:h-auto relative">
              <Image
                src={img}
                alt="ATS Checker"
                className="object-cover w-full h-full"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Improve Your ATS Score!
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Upload your resume and see how well it performs against ATS
                  systems.
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    const element = document.getElementById("ats-form");
                    element?.scrollIntoView({ behavior: "smooth" });
                    setOpenAd(false);
                  }}
                  className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition"
                >
                  Try Now
                </button>

                <button
                  onClick={() => setOpenAd(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}