import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Spinner } from "flowbite-react";
import { BufferSource } from "stream/web";

interface stringifiedBuffer{ // type decleration to handle the fact that the arrayBuffer ends up stringified, i could restore it from stringified before returning it in Client.js, but whatever
	data:Array<number>;
	type:"Buffer";

}

function createBlobAndOpen(arrayBuffer1:stringifiedBuffer) {
	console.log(arrayBuffer1);
    const arrayBuffer = new Uint8Array(arrayBuffer1.data); //genuinely have no clue how ANY of this works, chatGPT wrote this function. where tf does the.data property come frm. No CLUE. but it
    // Log the array buffer length for debugging purposes
    console.log('Creating blob with array buffer length:', arrayBuffer.byteLength);

    // Create a typed array (Uint8Array) from the array buffer
    const typedArray = new Uint8Array(arrayBuffer);

    // Create a Blob from the typed array
    const blob = new Blob([typedArray], { type: 'application/pdf' });
    console.log('Blob size:', blob.size);

     function isiPhone(): boolean {
        return /iPhone|iPod/.test(navigator.userAgent) && !hasMSStream(window);
    }

    // Type guard for navigator
    function hasMsSaveOrOpenBlob(navigator: Navigator): navigator is Navigator & { msSaveOrOpenBlob: (blob: Blob, defaultName?: string) => boolean } {
        return 'msSaveOrOpenBlob' in navigator;
    }

	function hasMSStream(window: Window): window is Window & { MSStream: any } {
        return 'MSStream' in window;
    }

    // Check if the window and navigator are available
    if (typeof window !== "undefined") {
        if (hasMsSaveOrOpenBlob(window.navigator)) {
            // For IE and Edge
            window.navigator.msSaveOrOpenBlob(blob, "document.pdf");
        } else {
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = blobUrl;

            if (isiPhone()) {
                anchor.target = '_self';  // Open in the current tab for iPhone
            } else {
                anchor.target = '_blank';  // Open in a new tab for other devices
            }

            // Add the anchor to the document body
            document.body.appendChild(anchor);

            // Trigger a click event on the anchor
            anchor.click();

            // Remove the anchor from the document body
            document.body.removeChild(anchor);

            // Clean up the object URL after some time
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }
    }
}






interface DocumentsProps {
	client: any;
	setToasts:any;
	setreRender:any;
	reRender:boolean;
	login:any;
	createError: (message:string)=>any;
}

export default function Documents({ client,createError }: DocumentsProps) {
	const router = useRouter();
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		
		console.log("preplexing, no?")
        async function getDocs(){
            await client.getDocuments().then(res=>{
				console.log("why")
                setDocuments(res);
			setLoading(false)})
            }
		try {
		if(client.documents.length!=0){
			setDocuments(client.documents)
			setLoading(false)
			
		}else{
			getDocs();}
		} catch(error) {
			console.log(error)
		}
	}, [client]);
    console.log("does this look empty to you?");
    console.log(documents);
	return (
		<div className="p-5 md:p-10 h-full flex-1">
			<Head>
				<title>Documents - Grade Melon</title>
			</Head>
			{loading ? (
				<div className="flex justify-center">
					<Spinner size="xl" color="pink" />
				</div>
			) : (
				<div className="overflow-x-auto max-w-max shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
					<table className="text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="py-3 pl-6">
									Date
								</th>
								<th scope="col" className="py-3 px-6">
									Document
								</th>
								<th scope="col" className="py-3 px-6">
									Category
								</th>
							</tr>
						</thead>
						<tbody>
							{documents &&
								documents.map((document, i) => (
									<tr
										className={`bg-${
											i % 2 == 0 ? "white" : "gray-50"
										} border-b dark:bg-gray-${
											i % 2 == 0 ? 900 : 800
										} dark:border-gray-700`}
										key={i}
									>
										<th
											scope="row"
											className="py-4 pl-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
										>
											{document.file.date}
										</th>
										<td className="py-4 px-6">
											<a
												onClick={async () => {
												    if(typeof(document.base64)=="undefined"){
													await client.getDocument(document.index).then(download=>{
														console.log(download);
														if(download.trouble){setDocuments(client.documents)}
														document.base64=download.download;
														console.log(download);
														createBlobAndOpen(document.base64);

													}).catch(error=>{
														console.log("hubba dubba wubba flubba"+error.message);
														createError(error.message);
													})
													}else{
													createBlobAndOpen(document.base64)}
												}}
												href="#"
											>
												{document.file.name}
											</a>
										</td>
										<td className="py-4 px-6">{document.category}</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
