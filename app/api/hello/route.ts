import type { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const rand = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
    let msg: string = "";

    switch (rand) {
        case 1: {
            msg = "1. Hello there!";
            break;
        }
        case 2: {
            msg = "2. Howya doin?";
            break;
        }
        case 3: {
            msg = "3. APIs are cool!";
            break;
        }
        default: {
            msg = "Generated number outside of 1-3";
            break;
        }
    }

    return Response.json({ message: msg });
}
