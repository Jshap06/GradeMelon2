import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { useRouter } from "next/router";
import { Schedule as ScheduleType } from "../utils/schedule";
import Head from "next/head";
import NotFound from "../components/404";
import {Grades as GradesType} from "../utils/grades"

interface ScheduleProps {
	client: any;
	grades:GradesType
}


export default function Schedule({ client,grades}: ScheduleProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(grades ? false : true);
	const [schedule, setSchedule] = useState<ScheduleType>();

	useEffect(()=>{
		if(!grades){router.push("/grades")}

	},[])

	return (
		<div className="p-5 md:p-10 h-full flex-1">
			<Head>
				<title>Schedule - Grade Melon</title>
			</Head>
			{loading ? (
				<div className="flex justify-center">
					<Spinner size="xl" color="pink" />
				</div>
			) : (
				<div className="max-w-max">
					<div className="max-w-max overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
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
										Room
									</th>
									<th scope="col" className="py-3 px-6">
										Teacher
									</th>
								</tr>
							</thead>
							<tbody>
								{grades.courses.map(({ period, name, room, teacher }, i) => (
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
											{period ? period : i}
										</th>
										<td className="py-4 px-6">{name}</td>
										<td className="py-4 px-6">{room}</td>
										<td className="py-4 px-6">
											<a href={`mailto:${teacher.email}`}>{teacher.name}</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
	</div>
	);
}
