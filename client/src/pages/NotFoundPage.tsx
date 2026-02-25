import { Button } from "../components/Button";
import { MoveLeft, Home, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <PageTransition>
            <div className="min-h-screen flex items-center justify-center p-6 bg-background">
                <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="relative mx-auto w-32 h-32">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                        <div className="relative flex items-center justify-center w-full h-full bg-card border-2 border-primary/20 rounded-full shadow-2xl">
                            <AlertCircle size={64} className="text-primary" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl font-black tracking-tighter">404</h1>
                        <h2 className="text-2xl font-bold">Page Not Found</h2>
                        <p className="text-muted-foreground font-medium">
                            Oops! The page you're looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2 h-12 font-bold rounded-xl"
                            onClick={() => navigate(-1)}
                        >
                            <MoveLeft size={18} />
                            Go Back
                        </Button>
                        <Button
                            className="flex-1 gap-2 h-12 font-bold rounded-xl shadow-lg shadow-primary/20"
                            onClick={() => navigate('/dashboard')}
                        >
                            <Home size={18} />
                            Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};
