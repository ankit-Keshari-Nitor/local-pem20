package com.precisely.pem.config;

import lombok.extern.slf4j.Slf4j;
import org.activiti.engine.delegate.event.ActivitiEventDispatcher;
import org.activiti.engine.delegate.event.ActivitiEventType;
import org.activiti.engine.delegate.event.impl.ActivitiEventBuilder;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.persistence.entity.ResourceEntity;
import org.activiti.engine.impl.persistence.entity.ResourceEntityManagerImpl;
import org.activiti.engine.impl.persistence.entity.data.ResourceDataManager;

import java.util.Base64;
@Slf4j
public class CustomResourceEntityManager extends ResourceEntityManagerImpl {

    public CustomResourceEntityManager(ProcessEngineConfigurationImpl processEngineConfiguration,
                                       ResourceDataManager resourceDataManager) {
        super(processEngineConfiguration, resourceDataManager);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void insert(ResourceEntity entity, boolean fireCreateEvent) {

		// TODO : Need to add encryption logic here once we implemented end to end flow.
        // We have used 64 encode/decode for now to implement this functionality,
        // We will replace this with vault concept later

        String diagram = new String(entity.getBytes());
		log.info("=========Insert : Input BPMN Schema=========");
        log.info(diagram);


        // encode without padding
        String encoded = Base64.getEncoder().withoutPadding().encodeToString(entity.getBytes());
		log.info("=========Insert :  Encoded BPMN Schema=========");
        entity.setBytes(encoded.getBytes());

        getDataManager().insert(entity); //this is resource insert method.

        ActivitiEventDispatcher eventDispatcher = getEventDispatcher();
        if (fireCreateEvent && eventDispatcher.isEnabled()) {
            eventDispatcher.dispatchEvent(ActivitiEventBuilder.createEntityEvent(ActivitiEventType.ENTITY_CREATED, entity));
            eventDispatcher.dispatchEvent(ActivitiEventBuilder.createEntityEvent(ActivitiEventType.ENTITY_INITIALIZED, entity));
        }
    }

}
