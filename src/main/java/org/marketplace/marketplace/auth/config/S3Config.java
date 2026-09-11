package org.marketplace.marketplace.auth.config;

import com.amazonaws.client.builder.AwsClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Configuration
public class S3Config {

	@Value( "${aws.access.key}" )
	private String accessKey;

	@Value( "${aws.secret.key}" )
	private String secretKey;

	@Value( "${aws.s3.region:us-east-2}" )
	private String region;

	@Value("${aws.s3.endpoint:}")
	private String endpoint;

	@Bean
	public AmazonS3 amazonS3Client() {

		BasicAWSCredentials awsCreds = new BasicAWSCredentials( accessKey, secretKey );
		AmazonS3ClientBuilder builder = AmazonS3ClientBuilder.standard()
											.withCredentials(new AWSStaticCredentialsProvider(awsCreds))
											.withPathStyleAccessEnabled(true);  // Required for Supabase

		if (endpoint != null && !endpoint.isEmpty()) {
			// Use custom endpoint for Supabase
			builder.withEndpointConfiguration(
				new AwsClientBuilder.EndpointConfiguration(endpoint, region)
			);
		} else {
			// Fall back to standard AWS
			builder.withRegion(region);
		}

		return builder.build();
	}
}