"use client"

export default function NextPage(){
    const score= JSON.parse(sessionStorage.getItem("score"))
    return <h1>score {score}</h1>
}