import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import Client from "../utils/client";
import { useRouter } from "next/router";
import { Flowbite, Toast } from "flowbite-react";
import Topbar from "../components/TopBar";
import SideBar from "../components/SideBar";
import MobileBar from "../components/MobileBar";
import { Grades } from "../utils/grades";
import Head from "next/head";
import Script from "next/script";
import { HiX } from "react-icons/hi";
import BackgroundColor from "../components/BackgroundColor";
import { AnimateSharedLayout } from "framer-motion";
import useWindowSize from '../hooks/useWindowSize';
import Cookies from "js-cookie";

interface Toast {
	title: string;
	type: "success" | "error" | "warning" | "info";
}

const noShowNav = ["/login", "/privacy", "/letter"];

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [districtURL, setDistrictURL] = useState("https://md-mcps-psv.edupoint.com");
	const [client, setClient] = useState(undefined);
	const [studentInfo, setStudentInfo] = useState(undefined);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [grades, setGrades] = useState<Grades>();
	const [period, setPeriod] = useState<number>();
	const [loading, setLoading] = useState(false);
	const [reRender,setreRender]=useState(false);
	const { width } = useWindowSize();
	const isMediumOrLarger = width >= 768;

	const login = async (username: string, password: string, save: boolean) => {
		setLoading(true);
		const student = new Client({ username, password },districtURL);
		try {
			await student.refresh();
			setClient(student);
			if (save) {
				localStorage.setItem("remember", "true");
				localStorage.setItem("username", username);
				Cookies.set('password',password,{expires:15/(24*60),secure:false,sameSite:"Lax"})
				localStorage.setItem("districtURL", districtURL);
			} else {
				localStorage.setItem("remember", "false");
				Cookies.remove("username");
				localStorage.removeItem("password");
			}
			setLoading(false);
			return true;
		} catch (err) {
			console.error(err);
			createError(err.message);
			setLoading(false);
			return false;
		}
	};



	const logout = async () => {
		setClient(undefined);
		router.push("/login");
		setStudentInfo(undefined);
		setGrades(undefined);
		if(localStorage.getItem("remember")=="false"){localStorage.removeItem("username")}
		Cookies.remove("password");
	};

	function createError(message:string){
		setToasts((toasts) => [...toasts, { title: message, type: "error" }]);
			setTimeout(() => {
				setToasts((toasts) => toasts.slice(1));
			}, 5000);
	}

	useEffect(()=>{
		console.log("major tom")
		async function asyncdoer(){await client.getStudentInfo().then(info=>{setStudentInfo(info)}).catch(error=>{createError(error.message);})}
		if(studentInfo===undefined&&client!=undefined){
			console.log("tsting testing")
			asyncdoer()
			console.log("well damn");
			console.log(studentInfo)
		}

	},[client,studentInfo])



	useEffect(() => {
		async function doLogin(){
			await login(localStorage.getItem("username"),Cookies.get("password"),true)}
		if(client===undefined&&localStorage.getItem("username")!=null&&Cookies.get("password")!=undefined){
			doLogin();
			
		}else{if(client===undefined&&!noShowNav.includes(router.pathname)){router.push("/login")}}
	}, [client]);

	return (
		<Flowbite>
			<Head>
				<title>Grade Melon</title>

			</Head>
			<Script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5925944145079992"
				crossOrigin="anonymous"
				strategy="beforeInteractive"
			/>
				<Script
					defer
					data-domain="grademelon.com"
					src="https://stats.tinu.tech/js/plausible.js"
				></Script>
				<Script
					defer
					src="https://static.cloudflareinsights.com/beacon.min.js"
					data-cf-beacon='{"token": "c01b4332f8c346bdbf9df1938384019b"}'
				></Script>
			<div className="absolute p-5 z-20">
				{toasts.map(({ title, type }, i) => (
					<div className="mb-5 z-50" key={i}>
						<Toast>
							<div
								onClick={() =>
									setToasts((prev) => {
										prev.splice(i, 1);
										return prev;
									})
								}
								className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
							>
								<HiX className="h-5 w-5" />
							</div>
							<div className="ml-3 text-sm font-normal">{title}</div>
							<Toast.Toggle />
						</Toast>
					</div>
				))}
			</div>
			<BackgroundColor />
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
				<Topbar studentInfo={studentInfo} logout={logout} client={client} />
				<div>
					{noShowNav.includes(router.pathname) && (
						<AnimateSharedLayout>
							<Component
								{...pageProps}
								districtURL={districtURL}
								setDistrictURL={setDistrictURL}
								login={login}
								client={client}
								grades={grades}
								setGrades={setGrades}
								setToasts={setToasts}
								loading={loading}
								period={period}
								setPeriod={setPeriod}
								setreRender={setreRender}
								reRender={reRender}
								createError={createError}
							/>
						</AnimateSharedLayout>
					)}

					{!noShowNav.includes(router.pathname) && isMediumOrLarger && (
						<div className="pb-16 md:pb-0">
							<div className="flex">
								<SideBar logout={logout} />
								<AnimateSharedLayout>
									<Component
										{...pageProps}
										districtURL={districtURL}
										setDistrictURL={setDistrictURL}
										client={client}
										login={login}
										grades={grades}
										setGrades={setGrades}
										setToasts={setToasts}
										loading={loading}
										period={period}
										setPeriod={setPeriod}
										setreRender={setreRender}
										reRender={reRender}
										createError={createError}
									/>
								</AnimateSharedLayout>
							</div>
						</div>
					)}
					{!noShowNav.includes(router.pathname) && !isMediumOrLarger && (
						<div className="pb-16 md:pb-0">
							<div className="md:hidden">
								<AnimateSharedLayout>
									<Component
										{...pageProps}
										districtURL={districtURL}
										client={client}
										login={login}
										setClient={setClient}
										grades={grades}
										setGrades={setGrades}
										setToasts={setToasts}
										loading={loading}
										period={period}
										setPeriod={setPeriod}
										setreRender={setreRender}
										reRender={reRender}
										createError={createError}
									/>
								</AnimateSharedLayout>
								<div className="px-4 fixed bottom-5 w-full">
									<MobileBar />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</Flowbite>
	);
}

export default MyApp;
