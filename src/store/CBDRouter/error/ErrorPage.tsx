import { useRouteError } from 'react-router-dom';
import * as Styled from './ErrorPage.styles';

interface RouteError {
  statusText?: string;
  message?: string;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  const isRouteError = (error: unknown): error is RouteError => {
    return (
      (error as RouteError).statusText !== undefined ||
      (error as RouteError).message !== undefined
    );
  };

  return (
    <Styled.Container id="error-page">
      <Styled.Heading>Oops!</Styled.Heading>
      <Styled.Message>Sorry, an unexpected error has occurred.</Styled.Message>
      <Styled.ErrorMessage>
        {isRouteError(error)
          ? error.statusText || error.message
          : 'An unknown error occurred.'}
      </Styled.ErrorMessage>
    </Styled.Container>
  );
};

export default ErrorPage;
