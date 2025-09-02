import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

// mock user (จริงๆ ต้องดึงจาก DB)
const mockUser = {
    username: "ibusiness",
    passwordHash: bcrypt.hashSync("123456", 10), // hash ของ "123456"
};

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (username !== mockUser.username) {
            return NextResponse.json({ message: "User not found" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, mockUser.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

        const response = NextResponse.json({ message: "Login success" });
        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60, // 1 ชม.
        });

        return response;
    } catch {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
