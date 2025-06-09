package org.marketplace.marketplace.auth.config;

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

	@Value( "${aws.access.key:AKIAUMYCIDD5ALS3RG7W}" )
	private String accessKey;

	@Value( "${aws.secret.key:Xl5u9f7IxnGMr7X98YHivKEh694hHjUKVdQhh3c7}" )
	private String secretKey;

	@Value( "${aws.s3.region:us-east-2}" )
	private String region;

	@Bean
	public AmazonS3 amazonS3Client() {

		BasicAWSCredentials awsCreds = new BasicAWSCredentials( accessKey, secretKey );

		return AmazonS3ClientBuilder.standard().withRegion( Regions.fromName( region ) )
				.withCredentials( new AWSStaticCredentialsProvider( awsCreds ) ).build();
	}
}