package com.precisely.pem.exceptionhandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.MultipartException;

import javax.naming.SizeLimitExceededException;
import java.time.LocalDateTime;
import java.util.prefs.InvalidPreferencesFormatException;

@ControllerAdvice
public class ResponseExceptionHandler{

    @ExceptionHandler(AlreadyDeletedException.class)
    protected ResponseEntity<Object> handleAlreadyDeletedException(AlreadyDeletedException ex, WebRequest request){
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(ex.getErrorCode());
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(ParamMissingException.class)
    protected ResponseEntity<Object> handleParamMissing(ParamMissingException ex, WebRequest request){
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(ex.getErrorCode());
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler({MultipartException.class, SizeLimitExceededException.class})
    protected ResponseEntity<Object> handleConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode("FileSizeIssue");
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(ex.getMessage());
        errResp.setFieldName("file");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidFileException.class)
    protected ResponseEntity<Object> handleFormatConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        String[] messages = ex.getLocalizedMessage().split(";");
        errResp.setErrorCode(messages[1]);
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(messages[2]);
        errResp.setFieldName(messages[0]);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    protected ResponseEntity<Object> handleResourceConflict(ResourceNotFoundException ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(ex.getErrorCode());
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errResp);
    }

    @ExceptionHandler(BpmnConverterException.class)
    protected ResponseEntity<Object> handleBpmnConverterConflict(BpmnConverterException ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode(ex.getErrorCode());
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    protected ResponseEntity<Object> handleCharacterConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        String[] messages = ex.getLocalizedMessage().split(";");
        errResp.setErrorCode(messages[1]);
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(messages[2]);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(OnlyOneDraftVersionException.class)
    protected ResponseEntity<Object> handleVersionConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        String[] messages = ex.getLocalizedMessage().split(";");
        errResp.setErrorCode(messages[1]);
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(messages[2]);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(InvalidPreferencesFormatException.class)
    protected ResponseEntity<Object> handleCaseConflict(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        String[] messages = ex.getLocalizedMessage().split(";");
        errResp.setErrorCode(messages[1]);
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(messages[2]);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    protected ResponseEntity<Object> handleGeneralConflict(HandlerMethodValidationException ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        String[] messages = ex.getLocalizedMessage().split(";");
        errResp.setErrorCode(messages[1]);
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(messages[2]);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValidException(Exception ex,  WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        if(ex instanceof MethodArgumentNotValidException exception) {
            exception.getBindingResult().getFieldErrors().forEach(objectError -> {
                String[] messages = objectError.getDefaultMessage().split(";");
                errResp.setFieldName(objectError.getField());
                //errResp.setFieldValue(Objects.requireNonNull(objectError.getRejectedValue()).toString());
                errResp.setTimestamp(LocalDateTime.now().toString());
                errResp.setErrorCode(messages[1]);
            });
            exception.getBindingResult().getAllErrors().forEach(objectError -> {
                String[] messages = objectError.getDefaultMessage().split(";");
                errResp.setMessage(messages[2]);
            });
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(DuplicateEntryException.class)
    protected ResponseEntity<Object> handleDuplicateException(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        String[] messages = ex.getLocalizedMessage().split(";");
        errResp.setErrorCode(messages[1]);
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(messages[2]);
        errResp.setFieldName(messages[0]);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }

    @ExceptionHandler(SchemaValidationException.class)
    protected ResponseEntity<Object> handleValidationException(SchemaValidationException ex, WebRequest request){
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode("ex.getErrorCode()");
        errResp.setTimestamp(LocalDateTime.now().toString());
        errResp.setMessage(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessageList());
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleGeneralException(Exception ex, WebRequest request) {
        ErrorResponseDto errResp = new ErrorResponseDto();
        errResp.setErrorCode("GenericIssue");
        errResp.setMessage(ex.getLocalizedMessage());
        ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResp);
    }
}
