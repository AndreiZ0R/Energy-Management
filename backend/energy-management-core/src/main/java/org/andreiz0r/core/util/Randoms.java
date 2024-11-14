package org.andreiz0r.core.util;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

public interface Randoms {
    int DEFAULT_UPPER_BOUND = 2000;

    static Integer randomInteger() {
        return ThreadLocalRandom.current().nextInt();
    }

    static Integer randomPositiveInteger() {
        return ThreadLocalRandom.current().nextInt(1, DEFAULT_UPPER_BOUND);
    }

    static Integer randomPositiveInteger(final int bound) {
        return ThreadLocalRandom.current().nextInt(1, bound);
    }

    static Boolean randomBoolean() {
        return ThreadLocalRandom.current().nextBoolean();
    }

    static String alphabetic() {
        return UUID.randomUUID().toString().replaceAll("_", "");
    }

    static String alphabetic(final Integer limit) {
        return UUID.randomUUID().toString().replaceAll("_", "").substring(0, limit);
    }
}
