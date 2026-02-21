import './Card.css';

export default function Card({
    children,
    variant = 'default',
    className = '',
    animate = true,
    ...props
}) {
    return (
        <div
            className={`card card--${variant} ${animate ? 'animate-fade-in-up' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
