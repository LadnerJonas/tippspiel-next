'use client'
import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button, Input} from "@nextui-org/react";

export default function login() {
    const router = useRouter()
    const [username, setUsername] = useState('')


    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            const body = {username}
            await fetch(`/api/user`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })
            router.push('/',)
            router.refresh()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <p className="text-3xl font-bold">Login</p>

                <form onSubmit={submitData}
                      style={{display: 'flex', flexDirection: 'column', width: '300px', gap: '20px'}} >
                    <Input
                        size="lg"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button size="lg" color="primary" type="submit" disabled={!username}>
                        Login
                    </Button>
                </form>
            </div>
        </>
    )
}
