import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import StudentVue from "studentvue";
import { useRouter } from "next/router";
import { Flowbite, Toast, useTheme } from "flowbite-react";
import Topbar from "../components/TopBar";
import SideBar from "../components/SideBar";
import MobileBar from "../components/MobileBar";
import { Grades } from "../utils/grades";
import Head from "next/head";
import { HiX } from "react-icons/hi";
import BackgroundColor from "../components/BackgroundColor";
import { AnimateSharedLayout } from "framer-motion";
import Cookies from "js-cookie";
import useWindowSize from '../hooks/useWindowSize';
import { Analytics } from "@vercel/analytics/react";
import allDistricts from "../lib/districts";

interface Toast {
	title: string;
	type: "success" | "error" | "warning" | "info";
}

const noShowNav = ["/login", "/", "/privacy", "/letter"];

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [districtURL, setDistrictURL] = useState(
		undefined
	);
	const [client, setClient] = useState(undefined);
	const [studentInfo, setStudentInfo] = useState(undefined);
	const [toasts, setToasts] = useState<Toast[]>([]);
	const [grades, setGrades] = useState<Grades>();
	const [period, setPeriod] = useState<number>();
	const [loading, setLoading] = useState(false);
	const [districts, setDistricts] = useState(allDistricts);
	const { width } = useWindowSize();
	const isMediumOrLarger = width >= 768;

	const login = async (
		username: string,
		password: string,
		save: boolean,
		url?: string,
		encrypted?:boolean
	) => {
		await setLoading(true);
		await StudentVue.login(url || districtURL, {
			username: username,
			password: password,
		},encrypted || false)
			.then(async (res) => {
				console.log("para me?")
				console.log(res);
				await setClient(res);
				if (save) {
					localStorage.setItem("remember", "true");
					Cookies.set("username",username,{expires:7,secure:false,sameSite:"Lax"})
					if(!encrypted){
						await fetch("https://nodejs-production-5ee5.up.railway.app" + "/encryptPassword", {
							'method': 'POST',
							'headers': { 'Content-Type': 'application/json' },
							'body': JSON.stringify({ 'password': password })
						}).then(async(response)=>{
							const result=await response.json()
							Cookies.set("password",result.encrpytedPassword,{expires:7})
						})}
					districts.forEach(district=>{
						if(district.parentVueUrl==districtURL){Cookies.set("districtURL",JSON.stringify(district))}
					})
				} else {
					localStorage.setItem("remember", "false");
					Cookies.remove("username");
					Cookies.remove("password");
					Cookies.remove("districtURL");
				}
				//if(router.pathname=="/"||router.pathname=="/login"){
					router.push("/grades")
				//}
				
				await setLoading(false);
				return true;
			})
			.catch((err) => {
				console.log(err);
				createError(err.message)
				setLoading(false);
			});

		return false;
	};



	useEffect(()=>{
		if(client!==undefined&&studentInfo==undefined){
			client.studentInfo().then(info=>{
				setStudentInfo(info)
				console.log(studentInfo)
			})
		}
	},[client])

	useEffect(() => {
		async function doLogin(){
			await login(Cookies.get("username"),Cookies.get("password"),true,districtURL,true)}
			if(Cookies.get("districtURL")!=undefined&&districtURL==undefined){
				console.log("RELEASE ME")
				console.log(JSON.parse(Cookies.get("districtURL")))
				setDistricts([JSON.parse(Cookies.get("districtURL"))])
				setDistrictURL(JSON.parse(Cookies.get("districtURL")).parentVueUrl)
				console.log(districtURL)
	
			}else{if(districtURL==undefined){setDistrictURL("https://md-mcps-psv.edupoint.com")}}
		if(client===undefined&&Cookies.get("username")!=undefined&&Cookies.get("password")!=undefined&&districtURL!==undefined){
			doLogin();
			
		}else{if(client===undefined&&(!noShowNav.includes(router.pathname)||router.pathname=="/")){router.push("/login")}}
	}, [client,districtURL]);

	function createError(message:string){
		setToasts((toasts) => [...toasts, { title: message, type: "error" }]);
			setTimeout(() => {
				setToasts((toasts) => toasts.slice(1));
			}, 5000);
	}

const logout = async () => {
	await Cookies.remove("password");
	await router.push("/login");
	 setClient(undefined);
	 setGrades(undefined);
	
	
	setStudentInfo(undefined);
	
	if(localStorage.getItem("remember")=="false"){Cookies.remove("username")}
	Cookies.remove("districtURL");

};

	// useEffect(() => {
	// 	let username = localStorage.getItem("username");
	// 	let password = localStorage.getItem("password");
	// 	let remember = localStorage.getItem("remember");
	// 	let storedDistrictURL = localStorage.getItem("districtURL");
	// 	storedDistrictURL && setDistrictURL(storedDistrictURL);
	// 	if (remember === "true" && username && password && storedDistrictURL) {
	// 		login(username, password, true, districtURL);
	// 	}
	// }, []);

	return (
		<Flowbite>
			<Analytics/>
			<Head>
				<title>Grade Melon</title>

			</Head>
			<script async src="https://www.googletagmanager.com/gtag/js?id=G-0CB45XNXR0"/>
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
								createError={createError}
								districts={districts}
								setDistricts={setDistricts}
							/>
						</AnimateSharedLayout>
					)}

					{!noShowNav.includes(router.pathname) && isMediumOrLarger && (
						<div className="pb-16 md:pb-0">
							<div className="flex">
								<SideBar studentInfo={studentInfo} logout={logout} />
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
										createError={createError}
										districts={districts}
										setDistricts={setDistricts}
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
										createError={createError}
										districts={districts}
										setDistricts={setDistricts}
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
