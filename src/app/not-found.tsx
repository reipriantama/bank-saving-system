import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 px-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-gray-900">404</CardTitle>
          <CardDescription className="text-xl mt-4">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/accounts">View Accounts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

