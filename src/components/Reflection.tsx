import styles from "./Reflection.module.css";

export interface ReflectionProps {
    children: React.ReactNode;
    icon?: string;
}
export function Reflection({ children, icon }: ReflectionProps) {
    return (
        <section className={styles.reflection}>
            <i className={styles.reflection__icon + " " + icon} aria-hidden="true"></i>
            <div className={styles.reflection__content}>
                {children}
            </div>
        </section>
    );
}
