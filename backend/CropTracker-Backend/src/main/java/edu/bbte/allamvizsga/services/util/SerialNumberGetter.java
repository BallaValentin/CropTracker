package edu.bbte.allamvizsga.services.util;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Comparator;

@Component
public class SerialNumberGetter {
    public Integer getNextNumber(Collection<String> names) {
        return names.stream().map(name -> {
                    if(!name.contains("(")) {
                        return 1;
                    }
                    try {
                        return Integer.parseInt(name.substring(name.lastIndexOf("(") + 1,
                                name.lastIndexOf(")")));
                    } catch (Exception e) {
                        return 1;
                    }
                }).max(Comparator.naturalOrder())
                .orElse(0) + 1;
    }
}
