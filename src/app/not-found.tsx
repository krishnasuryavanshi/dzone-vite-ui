import { Suspense } from "react";
import { AuthGuard } from "../auth/auth-guard";
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Suspense>
      <AuthGuard>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
        />
      </AuthGuard>
    </Suspense>
  );
}
