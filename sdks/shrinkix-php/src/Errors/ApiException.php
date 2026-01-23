<?php

namespace Shrinkix\Errors;

use Exception;

/**
 * API Error Exception
 */
class ApiException extends Exception
{
    protected string $errorCode;
    protected ?string $requestId;
    protected array $details;
    protected ?string $docsUrl;
    protected array $rateLimit;
    protected ?int $retryAfter;

    public function __construct(
        string $message,
        string $errorCode,
        int $statusCode,
        ?string $requestId = null,
        array $details = [],
        ?string $docsUrl = null,
        array $rateLimit = [],
        ?int $retryAfter = null
    ) {
        parent::__construct($message, $statusCode);
        $this->errorCode = $errorCode;
        $this->requestId = $requestId;
        $this->details = $details;
        $this->docsUrl = $docsUrl;
        $this->rateLimit = $rateLimit;
        $this->retryAfter = $retryAfter;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getRequestId(): ?string
    {
        return $this->requestId;
    }

    public function getDetails(): array
    {
        return $this->details;
    }

    public function getDocsUrl(): ?string
    {
        return $this->docsUrl;
    }

    public function getRateLimit(): array
    {
        return $this->rateLimit;
    }

    public function getRetryAfter(): ?int
    {
        return $this->retryAfter;
    }

    public function __toString(): string
    {
        return "{$this->errorCode}: {$this->message} (request_id: {$this->requestId})";
    }
}
