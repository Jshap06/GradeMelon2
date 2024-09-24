import React, { useState, useEffect, useRef} from "react";
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
import { Analytics } from "@vercel/analytics/react";


interface Toast {
	title: string;
	type: "success" | "error" | "warning" | "info";
}

const noShowNav = ["/login", "/", "/privacy", "/letter"];

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [districtURL, setDistrictURL] = useState("https://md-mcps-psv.edupoint.com")
	const [client, setClient] = useState(undefined);
	const [studentInfo, setStudentInfo] = useState(undefined);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [grades, setGrades] = useState<Grades>();
	const [grades2,setGrades2] = useState(undefined);
	const [period, setPeriod] = useState<number>();
	const [loading, setLoading] = useState<Boolean>(false);
	const [reRender,setreRender]=useState<Boolean>(false);
	const { width } = useWindowSize();
	const isMediumOrLarger = width >= 768;



	  



	const login = async (username: string, password: string, save: boolean,cookie=false) => {
		setLoading(true);
		const student = new Client({ username, password },districtURL);
		try {
			await student.refresh(cookie);
			setClient(student);
			if (save) {
				localStorage.setItem("remember", "true");
				Cookies.set("username",username,{expires:7,secure:false,sameSite:"Lax"})
				Cookies.set('password',student.credentials.password,{expires:7,secure:false,sameSite:"Lax"})
			} else {
				localStorage.setItem("remember", "false");
				Cookies.remove('password');
				Cookies.remove("username");
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
		if(localStorage.getItem("remember")=="false"){Cookies.remove("username")}
		Cookies.remove("password");

	};

	function createError(message:string){
		setToasts((toasts) => [...toasts, { title: message, type: "error" }]);
			setTimeout(() => {
				setToasts((toasts) => toasts.slice(1));
			}, 5000);
	}


	useEffect(()=>{
	if(typeof(window)!="undefined"){
	window.onerror = function (message, source, lineno, colno, error) {
		console.error('Global error caught:', message, error);
		// You can trigger a refresh or show a custom message to the user
		setTimeout(() => {
		  window.location.reload();  // Refresh the page after an error
		}, 1000);
	  };
	}
},[])

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
			await login(Cookies.get("username"),Cookies.get("password"),true,true)}
		if(client===undefined&&Cookies.get("username")!=undefined&&Cookies.get("password")!=undefined){
			doLogin();
			
		}else{if(client===undefined&&(!noShowNav.includes(router.pathname)||router.pathname=="/")){router.push("/login")}}
	}, [client]);

	return (
		<Flowbite>
			<Analytics/>
			<Head>
				<title>Grade Melon</title>

			</Head>
			<script async src="https://www.googletagmanager.com/gtag/js?id=G-0CB45XNXR0">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-0CB45XNXR0');
</script>
			<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4194284530688181"
     crossOrigin="anonymous"></script>
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
								grades2={grades2}
								setGrades2={setGrades2}
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
										grades2={grades2}
										setGrades2={setGrades2}
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
										grades2={grades2}
										setGrades2={setGrades2}
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
