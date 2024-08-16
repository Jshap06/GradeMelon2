import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { TbRefresh, TbMathSymbols } from "react-icons/tb";
import {
	parseGrades,
	Grades as GradesType,
	calculateGPA,
	updateGPA, letterGrade,letterGradeColor
} from "../../utils/grades";
import { Modal } from "flowbite-react";
import { motion } from "framer-motion";
interface GradesProps {
	client: any;
	grades: GradesType;
	setGrades: (grades: any) => void;
	setToasts: (toasts: any) => void;
	period: number;
	setPeriod: (period: number) => void;
}

export default function Grades({
	client,
	grades,
	setGrades,
	setToasts,
	period,
	setPeriod,
}: GradesProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(grades ? false : false);
	const [defaultView, setDefaultView] = useState("card");
	//const [period, setPeriod] = useState<number>();
	const [gpaModal, setGpaModal] = useState(false);
	const view = (router.query.view as string) || defaultView;

	useEffect(() => {
		if (localStorage.getItem("defaultView") !== null) {
			setDefaultView(localStorage.getItem("defaultView"));
		}
	}, []);

	useEffect(() => {
		if (router.query.view !== undefined) {
			setDefaultView(router.query.view as string);
			localStorage.setItem("defaultView", router.query.view as string);
		}
	}, [router.query.view]);

	useEffect(() => {
		try {
			if (!grades) {
				//setLoading(false);
				try {
				    const bullshit5={"period":{"name":"MP4 (ends in 34days)","index":"7"},"periods":[{"name":"MP1 Interim","index":"0"},{"name":"MP1","index":"1"},{"name":"MP2 Interim","index":"2"},{"name":"MP2","index":"3"},{"name":"MP3 Interim","index":"4"},{"name":"MP3","index":"5"},{"name":"MP4 Interim","index":"6"},{"name":"MP4 (ends in 24 days)","index":"7"}],"courses":[{"name":"AP GovPolitics US NSL B","period":"1","weighted":true,"room":"205","teacher":{"name":"Kenneth Heckert","email":"Kenneth.Heckert@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":446877,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"B","raw":"85.15","color":"blue"}},{"name":"Hon Chemistry B","period":"2","weighted":true,"room":"320","teacher":{"name":"Anne Marie O'Donoghue","email":"Anne.Marie O'Donoghue@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447399,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"C","raw":"75.75","color":"yellow"}},{"name":"Chorus HS 2B","period":"3","weighted":true,"room":"149","teacher":{"name":"Michelle Kim","email":"Michelle.Kim@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":446899,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"A","raw":"98.07","color":"green"}},{"name":"Hon Algebra 2B","period":"4","weighted":true,"room":"347","teacher":{"name":"Jillian Haker","email":"Jillian.Haker@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447312,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"C","raw":"75.71","color":"yellow"}},{"name":"Philosophy","period":"5","weighted":true,"room":"227","teacher":{"name":"Colin O'Brien","email":"Colin.O'Brien@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447040,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"A","raw":"92.00","color":"green"}},{"name":"Hon English 10B","period":"7","weighted":true,"room":"371","teacher":{"name":"Douglas Prouty","email":"Douglas.Prouty@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447287,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"A","raw":"94.14","color":"green"}},{"name":"Introduction to Engineering Design B","period":"8","weighted":true,"room":"245","teacher":{"name":"Michelle Innerarity","email":"Michelle.Innerarity@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447364,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"C","raw":"71.85","color":"yellow"}}],"gpa":0,"wgpa":0};
				    const grades = bullshit5;
				    setGrades(grades);
				    console.log(grades);

				} catch (err) {
					console.log(err);
					setToasts((toasts) => {
						return [
							...toasts,
							{
								title: err.message,
								type: "error",
							},
						];
					});
					setTimeout(() => {
						setToasts((toasts) => toasts.slice(1));
					}, 5000);
					setLoading(false);
				}
			}
		} catch {
			if (localStorage.getItem("remember") === "false") {
				router.push("/login");
			}
		}
	}, [client]);
    const bullshit5={"period":{"name":"MP4","index":"7"},"periods":[{"name":"MP1 Interim","index":"0"},{"name":"MP1","index":"1"},{"name":"MP2 Interim","index":"2"},{"name":"MP2","index":"3"},{"name":"MP3 Interim","index":"4"},{"name":"MP3","index":"5"},{"name":"MP4 Interim","index":"6"},{"name":"MP4","index":"7"}],"courses":[{"name":"1: AP GovPolitics US NSL B","period":"1","weighted":true,"room":"205","teacher":{"name":"Kenneth Heckert","email":"Kenneth.Heckert@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":446877,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"B","raw":"85.15","color":"blue"}},{"name":"Hon Chemistry B","period":"2","weighted":true,"room":"320","teacher":{"name":"Anne Marie O'Donoghue","email":"Anne.Marie O'Donoghue@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447399,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"75.75%","raw":"75.75","color":"75.75%"}},{"name":"Chorus HS 2B","period":"3","weighted":true,"room":"149","teacher":{"name":"Michelle Kim","email":"Michelle.Kim@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":446899,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"98.07%","raw":"98.07","color":"98.07%"}},{"name":"Hon Algebra 2B","period":"4","weighted":true,"room":"347","teacher":{"name":"Jillian Haker","email":"Jillian.Haker@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447312,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"75.71%","raw":"75.71","color":"75.71%"}},{"name":"Philosophy","period":"5","weighted":true,"room":"227","teacher":{"name":"Colin O'Brien","email":"Colin.O'Brien@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447040,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"92.00%","raw":"92.00","color":"92.00%"}},{"name":"7: Hon English 10B","period":"7","weighted":true,"room":"371","teacher":{"name":"Douglas Prouty","email":"Douglas.Prouty@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447287,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"94.14%","raw":"94.14","color":"94.14%"}},{"name":"8: Introduction to Engineering Design B","period":"8","weighted":true,"room":"245","teacher":{"name":"Michelle Innerarity","email":"Michelle.Innerarity@mcpsmd.net"},"loadstring":"{\"LoadParams\":{\"ControlName\":\"Gradebook_RichContentClassDetails\",\"HideHeader\":false},\"FocusArgs\":{\"viewName\":null,\"studentGU\":\"60798353-E035-4B63-BF65-299656E6625C\",\"schoolID\":191,\"classID\":447364,\"markPeriodGU\":\"C98B4CFE-0E80-4202-83E4-C41AC838B813\",\"gradePeriodGU\":\"9F456759-EF00-4356-B461-DBE5CB81C893\",\"subjectID\":-1,\"teacherID\":-1,\"assignmentID\":-1,\"standardIdentifier\":null,\"AGU\":\"0\",\"OrgYearGU\":\"A9BC53EB-660F-4ED1-816D-C4568471167B\",\"gradingPeriodGroup\":null}}","grade":{"letter":"71.85%","raw":"71.85","color":"71.85%"}}],"gpa":0,"wgpa":0};
    const update = (p: number) => {
	    console.log("nigga I get it I know that your mad");
		console.log(p);
		setLoading(false);
		client
			.gradebook(p)
			.then((res) => {
				console.log(res);
				setGrades(bullshit5);
				setLoading(false);
				setPeriod(p);
				console.log("HERES WHATS UP FOOOL");
			})
			.catch((err) => {
				console.log(err);
				setToasts((toasts) => {
					return [
						...toasts,
						{
							title: err.message,
							type: "error",
						},
					];
				});
				setLoading(false);
			});
	};

	useEffect(() => {
		if (gpaModal) {
			setGrades(calculateGPA(grades));
		}
	}, [gpaModal]);

	const changeWeights = (e, i: number) => {
		setGrades(updateGPA(grades, i, e.target.checked));
	};

	return (
<motion.div className="p-5 md:p-10 flex-1 overflow-hidden">
    <Head>
        <title>Gradebook - Grade Melon</title>
    </Head>
    <Modal show={gpaModal} onClose={() => setGpaModal(false)}>
        <Modal.Header>GPA Calculator</Modal.Header>
        <Modal.Body>
            <p className="dark:text-white font-bold text-xl">
                <script>
                console.log(grades)
                </script>
                GPA: {grades?.gpa.toFixed(2)}
            </p>
            <p className="dark:text-white font-bold text-xl pb-5">
                WGPA: {grades?.wgpa.toFixed(2)}
            </p>

            <p className="dark:text-white font-bold text-xl">Weighted?</p>
            {grades?.courses.map((course, i) => (
                <div className="flex gap-2 items-center pt-2" key={i}>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={course?.weighted}
                            className="sr-only peer"
                            onChange={(e) => changeWeights(e, i)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                    <p className="dark:text-white text-md md:text-lg">
                        {course?.name}
                    </p>
                </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
            <div className="flex gap-2">
                <button
                    onClick={() => setGpaModal(false)}
                    className="rounded-lg bg-gray-500 px-2.5 py-2.5 text-center text-xs sm:text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                    Close
                </button>
            </div>
        </Modal.Footer>
    </Modal>
    {loading ? (
        <div className="flex justify-center">
            <Spinner size="xl" color="pink" />
        </div>
    ) : (
        <div className="p-1 md:max-w-max mx-auto md:mx-0">
            <div className="flex gap-2 mb-5">
                <button
                    type="button"
                    onClick={() => update(period)}
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                    <TbRefresh size={"1.3rem"} />
                </button>
                <select
                    id="periods"
                    onChange={(e) => update(parseInt(e.target.value))}
                    value={grades?.period.index}
                    className="min-w-min block w-full p-2 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                    {grades?.periods.map((period) => (
                        <option value={period.index} key={period.index}>
                            {period.name}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={() => setGpaModal(true)}
                    className=" bg-primary-500 border border-primary-500 focus:outline-none hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm p-2.5 dark:bg-primary-600 text-white dark:hover:bg-primary-700 dark:focus:ring-primary-400"
                >
                    <TbMathSymbols size={"1.3rem"} />
                </button>
            </div>
            {view === "card" && (
                <div
                    className="grid gap-5 2col:grid-cols-2 3col:grid-cols-3 4col:grid-cols-4 items-stretch w-full"
					
                >
                    {grades?.courses.map(({ name, period, grade, teacher }, i) => (
                        <div className="w-full md:w-96" key={i}>
                            <motion.div
                                layout="preserve-aspect"
                                layoutId={`card-${period}`}
                                className="h-full w-full flex flex-col justify-between gap-2 md:gap-5 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 mx-auto"
                            >
                                <div className="">
                                    <Link href={`/grades/${i}`} legacyBehavior>
                                        <div className="hover:cursor-pointer">
                                            <h5 className="md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                                <p className="font-bold">
                                                    {period} -{" "}
                                                    <motion.span
                                                        layout
                                                        layoutId={`name-${period}`}
                                                        className="font-semibold"
                                                    >
                                                        {name}
                                                    </motion.span>
                                                </p>
                                            </h5>
                                            <motion.p
                                                layoutId={`teacher-${period}`}
                                                layout
                                                className="text-md tracking-tight text-gray-900 dark:text-white"
                                            >
                                                {teacher.name}
                                            </motion.p>
                                        </div>
                                    </Link>
                                </div>
                                <div className="">
                                    <div className="flex items-center justify-between">
                                        <motion.span
                                            layoutId={`grade-${period}`}
                                            layout="preserve-aspect"
                                            className={`text-xl md:text-3xl font-bold text-${grade.color}-400`}
                                        >
                                            {grade.letter}
                                            {!isNaN(grade.raw) && ` (${grade.raw}%)`}
                                        </motion.span>
                                        <Link href={`/grades/${i}`} legacyBehavior>
                                            <button className="rounded-lg bg-primary-500 px-5 py-2.5 text-center text-xs sm:text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                View
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
							))}
						</div>
					)}
					{view === "table" && (
						<div className="overflow-x-auto max-w-max -md rounded-lg border border-gray-200 dark:border-gray-700">
							<table className="text-sm text-left text-gray-500 dark:text-gray-400">
								<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="py-3 pl-6">
											Period
										</th>
										<th scope="col" className="py-3 px-6">
											Course Name
										</th>
										<th scope="col" className="py-3 px-6">
											Teacher
										</th>
										<th scope="col" className="py-3 px-6">
											Grade
										</th>
									</tr>
								</thead>
								<tbody>
									{grades?.courses.map(
										({ name, period, grade, teacher }, i) => (
											<tr
												className={`bg-${
													i % 2 == 0 ? "white" : "gray-50"
												} border-b dark:bg-gray-${
													i % 2 == 0 ? 900 : 800
												} dark:border-gray-700`}
												key={i}
											>
												<td
													scope="row"
													className="py-4 pl-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
												>
													{period}
												</td>
												<td className="py-4 px-6">
													<Link href={`/grades/${i}`} legacyBehavior>
														{name}
													</Link>
												</td>
												<td className="py-4 px-6">{teacher.name}</td>
												<td className="py-4 px-6">
													<span className={`font-bold text-${grade.color}-400`}>
														{grade.letter}
														{!isNaN(grade.raw) && ` (${grade.raw}%)`}
													</span>
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</motion.div>
	);
}
