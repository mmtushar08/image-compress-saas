<?php

namespace Shrinkix\Errors;

use Exception;

/**
 * Network Error Exception
 */
class NetworkException extends Exception
{
    protected ?Exception $originalException;

    public function __construct(string $message, ?Exception $originalException = null)
    {
        parent::__construct($message);
        $this->originalException = $originalException;
    }

    public function getOriginalException(): ?Exception
    {
        return $this->originalException;
    }
}
