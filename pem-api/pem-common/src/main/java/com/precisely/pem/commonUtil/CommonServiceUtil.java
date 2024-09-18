package com.precisely.pem.commonUtil;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import com.precisely.pem.exceptionhandler.SchemaValidationDto;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

public class CommonServiceUtil {

    static ObjectMapper objMapper = new ObjectMapper();

    public static List<SchemaValidationDto> validateJsonUsingJSONSchema(InputStream is) throws IOException {
        JsonSchemaFactory factory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V4);
        InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream("Json_schema.json");
        JsonSchema jsonSchema = factory.getSchema(inputStream);
        JsonNode jsonNode = objMapper.readTree(is);
        Set<ValidationMessage> errors = jsonSchema.validate(jsonNode);
        return errors.stream().map(p -> new SchemaValidationDto(p.getCode(), p.getType(), p.getMessage())).toList();
    }

    public static byte[] convertInputStreamToByteArray(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int bytesRead;
        byte[] data = new byte[1024];

        while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, bytesRead);
        }

        buffer.flush();
        return buffer.toByteArray();
    }
}
