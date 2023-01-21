import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { UserModel } from "models/user";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const user = new UserModel();
    const userName = user.get().name;
    return (
        <main className={styles.main}>
            <div className={styles.center} />
            <p>I am the amazing {userName}, deal with it</p>
        </main>
    );
}
